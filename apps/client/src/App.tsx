import { useMemo, useRef, useState, useEffect } from "react";
import {
  applyMove,
  checkWinner,
  createInitialBoard,
  isPlayableDestination,
  listLegalMoves,
  type Coord,
  type Player
} from "@jumpfrog/rules";
import type { RoomCreatedPayload } from "@jumpfrog/shared";
import { AnimatedHopOverlay } from "./components/AnimatedHopOverlay";
import { GameHeader } from "./components/GameHeader/GameHeader";
import { GameStatus } from "./components/GameStatus/GameStatus";
import { Board } from "./components/Board/Board";
import { MenuScreen } from "./components/MenuScreen/MenuScreen";
import { SettingsScreen } from "./components/SettingsScreen/SettingsScreen";
import { TutorialScreen } from "./components/TutorialScreen/TutorialScreen";
import { JumpContinuationOverlay } from "./components/JumpContinuationOverlay/JumpContinuationOverlay";
import { WaitingForOpponent } from "./components/WaitingForOpponent/WaitingForOpponent";
import { useFrogHop } from "./anim/useFrogHop";
import { useBoardMeasurement } from "./hooks/useBoardMeasurement";
import { useJumpContinuation } from "./hooks/useJumpContinuation";
import { useOnlineGame } from "./hooks/useOnlineGame";
import { coordsEqual } from "./utils/coordHelpers";
import { getMoveTarget, getMoveStart, getMovePath } from "./utils/moveHelpers";
import { otherPlayer } from "./utils/playerHelpers";
import { ANIMATION_DURATION, FROG_SIZE, HOP_HEIGHT, JUMP_WINDOW_MS } from "./constants/game";
import { sfx } from "./anim/sfx_realistic";
import { chooseBotAction } from "./ai/minimax";
import type { Screen, GameMode, Settings, BotDifficulty } from "./types/game";
import type { Move } from "@jumpfrog/rules";
import { useTranslation } from "./i18n/LanguageContext";
import { socket } from "./net/socket";
import "./App.css";

const parseRoomIdFromLocation = (): string | null => {
  const { pathname, search } = window.location;
  if (pathname.startsWith("/play/")) {
    const roomId = pathname.replace("/play/", "").trim();
    return roomId.length > 0 ? roomId : null;
  }
  const params = new URLSearchParams(search);
  return params.get("roomId");
};

function App() {
  const { t } = useTranslation();
  const initialRoomId = useMemo(parseRoomIdFromLocation, []);
  // Screen navigation state
  const [currentScreen, setCurrentScreen] = useState<Screen>(
    initialRoomId ? "GAME" : "MENU"
  );
  const [gameMode, setGameMode] = useState<GameMode>(
    initialRoomId ? "ONLINE" : "LOCAL"
  );
  const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>("MEDIUM");
  const [onlineRoomId, setOnlineRoomId] = useState<string | null>(initialRoomId);
  
  // Settings state with defaults
  const [settings, setSettings] = useState<Settings>({
    theme: "green",
    soundEnabled: true,
    soundVolume: 0.7,
    animationSpeed: "normal",
    boardFlipped: false,
    reduceMotion: false,
    resumeLastGame: false,
  });

  // Game state
  const [board, setBoard] = useState(createInitialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>("GREEN");
  const [selected, setSelected] = useState<Coord | null>(null);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const audioUnlockedRef = useRef(false);

  const { active: hop, isAnimating, playSegment } = useFrogHop();
  const { cellSize, boardRef, cellCenter, updateCellSize } = useBoardMeasurement();
  const {
    continuationFrogId,
    continuationFromCoord,
    jumpTimerMs,
    startContinuation,
    clearContinuation,
    endTurnManually
  } = useJumpContinuation(setCurrentPlayer, currentPlayer);
  const {
    state: onlineState,
    myColor,
    isMyTurn,
    lastError,
    isWaitingForOpponent,
    sendMove,
    endTurn
  } = useOnlineGame(onlineRoomId);

  // Force board remeasurement when entering game screen
  useEffect(() => {
    if (currentScreen === "GAME") {
      setTimeout(() => {
        updateCellSize();
      }, 10);
    }
  }, [currentScreen, updateCellSize]);

  useEffect(() => {
    const handleRoomCreated = (payload: RoomCreatedPayload) => {
      setOnlineRoomId(payload.roomId);
      setGameMode("ONLINE");
      setCurrentScreen("GAME");
      window.history.pushState({}, "", `/play/${payload.roomId}`);
    };

    socket.on("room:created", handleRoomCreated);
    return () => {
      socket.off("room:created", handleRoomCreated);
    };
  }, []);

  const isOnline = gameMode === "ONLINE";
  const activeBoard = isOnline && onlineState ? onlineState.board : board;
  const activeCurrentPlayer =
    isOnline && onlineState ? onlineState.currentPlayer : currentPlayer;
  const localWinner = useMemo(() => checkWinner(board), [board]);
  const winner = isOnline ? onlineState?.winner ?? null : localWinner;
  const activeContinuationPieceId = isOnline
    ? onlineState?.continuation?.pieceId ?? null
    : continuationFrogId;
  const activeJumpTimerMs = isOnline
    ? onlineState?.continuation?.remainingMs ?? null
    : jumpTimerMs;

  const legalMoves = useMemo(() => {
    if (isOnline) {
      if (!isMyTurn || !onlineState) return [];
      return listLegalMoves(onlineState.board, onlineState.currentPlayer);
    }
    return listLegalMoves(board, currentPlayer);
  }, [isOnline, isMyTurn, onlineState, board, currentPlayer]);

  const filteredLegalMoves = useMemo(() => {
    if (activeContinuationPieceId === null) return legalMoves;
    return legalMoves.filter((move) => {
      if (move.type !== "JUMP") return false;
      const start = getMoveStart(move);
      const piece = activeBoard[start.r][start.c];
      if (piece?.id !== activeContinuationPieceId) return false;
      if (
        !isOnline &&
        continuationFromCoord &&
        coordsEqual(getMoveTarget(move), continuationFromCoord)
      ) {
        return false;
      }
      return true;
    });
  }, [
    legalMoves,
    activeContinuationPieceId,
    continuationFromCoord,
    activeBoard,
    isOnline
  ]);

  const selectedMoves = useMemo(() => {
    if (!selected) return [];
    return filteredLegalMoves.filter((move) =>
      coordsEqual(getMoveStart(move), selected)
    );
  }, [filteredLegalMoves, selected]);

  const targetSquares = useMemo(
    () => selectedMoves.map((move) => getMoveTarget(move)),
    [selectedMoves]
  );

  useEffect(() => {
    if (!isOnline) return;
    if (!isMyTurn) {
      setSelected(null);
    }
  }, [isOnline, isMyTurn, onlineState]);

  // Bot AI move trigger
  useEffect(() => {
    // Only make bot moves in bot mode when it's BLACK's turn and not animating
    if (
      gameMode !== "BOT" ||
      currentPlayer !== "BLACK" ||
      winner ||
      isAnimating ||
      isBotThinking
    ) {
      return;
    }

    // If there's a continuation, bot should make the next jump immediately (but with a small delay)
    const isInContinuation = continuationFrogId !== null;

    setIsBotThinking(true);

    // Add a small delay so the bot doesn't move instantly (feels more natural)
    // Shorter delay during continuation
    const thinkingDelay = isInContinuation 
      ? 300 
      : (botDifficulty === "EASY" ? 500 : botDifficulty === "MEDIUM" ? 400 : 300);

    const timerId = setTimeout(() => {
      try {
        const timeLimitMs = botDifficulty === "EASY" ? 150 : botDifficulty === "MEDIUM" ? 300 : 800;
        const action = chooseBotAction({
          board,
          botPlayer: "BLACK",
          continuationPieceId: continuationFrogId,
          continuationFromCoord,
          difficulty: botDifficulty,
          timeLimitMs
        });

        if (action.type === "MOVE") {
          if (isInContinuation) {
            clearContinuation();
          }
          executeBotMove(action.move);
          return;
        }

        // No legal continuation jumps or moves available
        if (isInContinuation) {
          clearContinuation();
        }
        setIsBotThinking(false);
        setCurrentPlayer("GREEN");
      } catch (error) {
        console.error("Bot move error:", error);
        setIsBotThinking(false);
      }
    }, thinkingDelay);

    return () => {
      clearTimeout(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, currentPlayer, gameMode, botDifficulty, winner, isAnimating, continuationFrogId]);

  const handleSquareClick = async (coord: Coord) => {
    if (isOnline) {
      if (!onlineState || !isMyTurn || winner || isAnimating || !myColor) {
        return;
      }

      const piece = activeBoard[coord.r][coord.c];
      if (piece && piece.owner === myColor) {
        if (activeContinuationPieceId && piece.id !== activeContinuationPieceId) {
          return;
        }
        setSelected(coord);
        return;
      }

      if (!selected) {
        return;
      }

      const chosenMove = selectedMoves.find((move) =>
        coordsEqual(getMoveTarget(move), coord)
      );

      if (!chosenMove) {
        setSelected(null);
        return;
      }

      setSelected(null);
      sendMove(chosenMove);
      return;
    }

    // Prevent clicks during bot's turn
    if (gameMode === "BOT" && currentPlayer === "BLACK") {
      return;
    }

    if (!isPlayableDestination(coord, currentPlayer) || winner || isAnimating) {
      return;
    }

    // Unlock audio on first user interaction
    if (!audioUnlockedRef.current) {
      await sfx.unlock();
      audioUnlockedRef.current = true;
    }

    const piece = board[coord.r][coord.c];
    if (piece && piece.owner === currentPlayer) {
      if (continuationFrogId !== null && piece.id !== continuationFrogId) {
        return;
      }
      setSelected(coord);
      return;
    }

    if (!selected) {
      return;
    }

    const chosenMove = selectedMoves.find((move) =>
      coordsEqual(getMoveTarget(move), coord)
    );

    if (!chosenMove) {
      setSelected(null);
      return;
    }

    const path = getMovePath(chosenMove);
    const pieceToMove = board[path[0].r][path[0].c];
    if (!pieceToMove) {
      setSelected(null);
      return;
    }

    const baseDurationMs =
      chosenMove.type === "STEP"
        ? ANIMATION_DURATION.STEP
        : ANIMATION_DURATION.JUMP;
    const from = path[0];
    const to = path[1];
    const fromPx = cellCenter(from);
    const toPx = cellCenter(to);

    setSelected(null);

    if (fromPx && toPx) {
      const dist = Math.hypot(toPx.x - fromPx.x, toPx.y - fromPx.y);
      const hopHeight = Math.max(HOP_HEIGHT.MIN, Math.min(HOP_HEIGHT.MAX, dist * HOP_HEIGHT.MULTIPLIER));
      
      // Play jump sound
      sfx.jumpBass();
      
      await playSegment({
        pieceId: pieceToMove.id,
        color: pieceToMove.owner,
        from: fromPx,
        to: toPx,
        hop: hopHeight,
        durationMs: baseDurationMs
      });
      
      // Play landing sound
      sfx.landBassWet();
    }

    const nextBoard = applyMove(board, chosenMove);
    const nextWinner = checkWinner(nextBoard);
    setBoard(nextBoard);

    if (chosenMove.type === "STEP") {
      clearContinuation();
      setCurrentPlayer(nextWinner ? currentPlayer : otherPlayer(currentPlayer));
    } else {
      const landedPiece = nextBoard[to.r][to.c];
      const jumpsFromLanding = listLegalMoves(nextBoard, currentPlayer).filter(
        (m) =>
          m.type === "JUMP" &&
          m.path[0].r === to.r &&
          m.path[0].c === to.c &&
          !coordsEqual(getMoveTarget(m), from)
      );
      const canJumpAgain = landedPiece && jumpsFromLanding.length > 0;
      if (nextWinner || !canJumpAgain) {
        clearContinuation();
        setCurrentPlayer(nextWinner ? currentPlayer : otherPlayer(currentPlayer));
      } else {
        startContinuation(pieceToMove.id, from);
        // Auto-select the landed piece so the player sees continuation targets immediately
        setSelected(to);
      }
    }
  };

  const handleReset = () => {
    setBoard(createInitialBoard());
    setCurrentPlayer("GREEN");
    setSelected(null);
    clearContinuation();
    setIsBotThinking(false);
  };

  const handleLeaveOnline = () => {
    if (onlineRoomId) {
      socket.emit("room:leave", { roomId: onlineRoomId });
    }
    setOnlineRoomId(null);
    setGameMode("LOCAL");
    setSelected(null);
    setCurrentScreen("MENU");
    if (window.location.pathname.startsWith("/play")) {
      window.history.pushState({}, "", "/");
    }
  };

  // Execute a bot move
  const executeBotMove = async (move: Move) => {
    try {
      const path = getMovePath(move);
      const pieceToMove = board[path[0].r][path[0].c];
      if (!pieceToMove) {
        setIsBotThinking(false);
        return;
      }

      const baseDurationMs =
        move.type === "STEP"
          ? ANIMATION_DURATION.STEP
          : ANIMATION_DURATION.JUMP;
      const from = path[0];
      const to = path[1];
      const fromPx = cellCenter(from);
      const toPx = cellCenter(to);

      if (fromPx && toPx) {
        const dist = Math.hypot(toPx.x - fromPx.x, toPx.y - fromPx.y);
        const hopHeight = Math.max(HOP_HEIGHT.MIN, Math.min(HOP_HEIGHT.MAX, dist * HOP_HEIGHT.MULTIPLIER));
        
        // Play jump sound
        sfx.jumpBass();
        
        await playSegment({
          pieceId: pieceToMove.id,
          color: pieceToMove.owner,
          from: fromPx,
          to: toPx,
          hop: hopHeight,
          durationMs: baseDurationMs
        });
        
        // Play landing sound
        sfx.landBassWet();
      }

      const nextBoard = applyMove(board, move);
      const nextWinner = checkWinner(nextBoard);
      setBoard(nextBoard);

      if (move.type === "STEP") {
        clearContinuation();
        setCurrentPlayer(nextWinner ? currentPlayer : otherPlayer(currentPlayer));
        setIsBotThinking(false);
      } else {
        const landedPiece = nextBoard[to.r][to.c];
        const jumpsFromLanding = listLegalMoves(nextBoard, currentPlayer).filter(
          (m) =>
            m.type === "JUMP" &&
            m.path[0].r === to.r &&
            m.path[0].c === to.c &&
            !coordsEqual(getMoveTarget(m), from)
        );
        const canJumpAgain = landedPiece && jumpsFromLanding.length > 0;
        if (nextWinner || !canJumpAgain) {
          clearContinuation();
          setCurrentPlayer(nextWinner ? currentPlayer : otherPlayer(currentPlayer));
          setIsBotThinking(false);
        } else {
          // Bot continues jumping - set continuation state to trigger next move
          // This will cause the useEffect to trigger and make the next move
          startContinuation(pieceToMove.id, from);
          setIsBotThinking(false);
        }
      }
    } catch (error) {
      console.error("Error executing bot move:", error);
      setIsBotThinking(false);
      // Fallback: switch to player's turn
      setCurrentPlayer("GREEN");
    }
  };

  // Navigation handlers
  const handleStartLocal = () => {
    setGameMode("LOCAL");
    handleReset();
    setCurrentScreen("GAME");
  };

  const handleStartBot = (difficulty: BotDifficulty = "MEDIUM") => {
    setGameMode("BOT");
    setBotDifficulty(difficulty);
    handleReset();
    setCurrentScreen("GAME");
  };

  const handleOpenTutorial = () => {
    setCurrentScreen("TUTORIAL");
  };

  const handleOpenSettings = () => {
    setCurrentScreen("SETTINGS");
  };

  const handlePlayOnline = () => {
    socket.emit("room:create");
  };

  const handleBackToMenu = () => {
    setCurrentScreen("MENU");
  };

  const handleResume = () => {
    // For now, just start a new game - resume functionality can be added later
    setCurrentScreen("GAME");
  };

  // Render current screen
  if (currentScreen === "MENU") {
    return (
      <MenuScreen
        lastMode={gameMode}
        hasSavedGame={false}
        onResume={handleResume}
        onStartLocal={handleStartLocal}
        onStartBot={handleStartBot}
        onPlayOnline={handlePlayOnline}
        onOpenSettings={handleOpenSettings}
        onTutorial={handleOpenTutorial}
      />
    );
  }

  if (currentScreen === "SETTINGS") {
    return (
      <SettingsScreen
        settings={settings}
        onChange={setSettings}
        onBack={handleBackToMenu}
      />
    );
  }

  if (currentScreen === "TUTORIAL") {
    return (
      <TutorialScreen onBack={handleBackToMenu} />
    );
  }

  // GAME screen
  return (
    <div className="app">
      <GameHeader
        currentPlayer={activeCurrentPlayer}
        onReset={isOnline ? handleLeaveOnline : handleReset}
        onBack={isOnline ? handleLeaveOnline : handleBackToMenu}
        resetLabel={isOnline ? t.gameHeader_leaveRoom : t.gameHeader_resetGame}
      />

      <div className="game-area">
        <GameStatus 
          winner={winner} 
          jumpTimerMs={activeJumpTimerMs}
          isBotThinking={isOnline ? false : isBotThinking}
        />

        <Board
          board={activeBoard}
          selected={selected}
          targetSquares={targetSquares}
          animatingPieceId={hop?.pieceId ?? null}
          continuationFrogId={activeContinuationPieceId}
          cellSize={cellSize}
          boardRef={boardRef}
          disabled={Boolean(winner) || isAnimating || (isOnline && !isMyTurn)}
          onSquareClick={handleSquareClick}
          myColor={isOnline ? myColor : null}
        />
      </div>

      {isOnline && onlineRoomId && !isWaitingForOpponent ? (
        <div className="online-share">
          <button
            onClick={() => {
              const shareUrl = `${window.location.origin}/play/${onlineRoomId}`;
              navigator.clipboard?.writeText(shareUrl);
            }}
          >
            {t.online_copyLink}
          </button>
          <button
            onClick={() => {
              const shareUrl = `${window.location.origin}/play/${onlineRoomId}`;
              window.open(
                `https://wa.me/?text=${encodeURIComponent(shareUrl)}`,
                "_blank"
              );
            }}
          >
            {t.online_shareWhatsApp}
          </button>
        </div>
      ) : null}

      {isOnline && lastError ? (
        <div className="online-error">{lastError}</div>
      ) : null}

      {hop && cellSize > 0 ? (
        <AnimatedHopOverlay hop={hop} size={cellSize * FROG_SIZE.ANIMATED} />
      ) : null}

      {activeJumpTimerMs !== null && !winner && (gameMode !== "BOT" || currentPlayer !== "BLACK") ? (
        <JumpContinuationOverlay
          timeRemainingMs={activeJumpTimerMs ?? 0}
          totalDurationMs={JUMP_WINDOW_MS}
          onEndTurn={isOnline ? endTurn : endTurnManually}
          canEndTurn={!isOnline || isMyTurn}
        />
      ) : null}

      {isOnline && isWaitingForOpponent && onlineRoomId ? (
        <WaitingForOpponent roomId={onlineRoomId} />
      ) : null}
    </div>
  );
}

export default App;
