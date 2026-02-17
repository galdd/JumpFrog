import { useCallback, useEffect, useMemo, useState } from "react";
import type { Move, Player } from "@jumpfrog/rules";
import type {
  RoomErrorPayload,
  RoomStatePayload,
  ServerGameState
} from "@jumpfrog/shared";
import { socket } from "../net/socket";

type OnlineState = {
  state: ServerGameState | null;
  myColor: Player | null;
  isMyTurn: boolean;
  lastError: string | null;
  isWaitingForOpponent: boolean;
};

const getMyColor = (state: ServerGameState | null, socketId: string | undefined) => {
  if (!state || !socketId) return null;
  return state.players[socketId]?.color ?? null;
};

export const useOnlineGame = (roomId: string | null) => {
  const [state, setState] = useState<ServerGameState | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [socketId, setSocketId] = useState<string | undefined>(socket.id);

  useEffect(() => {
    const handleConnect = () => {
      setSocketId(socket.id);
      if (roomId) {
        socket.emit("room:join", { roomId });
      }
    };

    const handleRoomState = (payload: RoomStatePayload) => {
      if (!roomId || payload.roomId !== roomId) return;
      setState(payload.state);
      setLastError(null);
    };

    const handleRoomError = (payload: RoomErrorPayload) => {
      setLastError(payload.message);
    };

    socket.on("connect", handleConnect);
    socket.on("room:state", handleRoomState);
    socket.on("room:error", handleRoomError);

    if (socket.connected && roomId) {
      socket.emit("room:join", { roomId });
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("room:state", handleRoomState);
      socket.off("room:error", handleRoomError);
    };
  }, [roomId]);

  const myColor = useMemo(() => getMyColor(state, socketId), [state, socketId]);
  const isMyTurn = Boolean(
    state && myColor && state.currentPlayer === myColor
  );
  const isWaitingForOpponent = Boolean(
    state && Object.keys(state.players).length < 2
  );

  const sendMove = useCallback(
    (move: Move) => {
      if (!roomId) return;
      socket.emit("move:request", { roomId, move });
    },
    [roomId]
  );

  const endTurn = useCallback(() => {
    if (!roomId) return;
    socket.emit("turn:end", { roomId });
  }, [roomId]);

  const onlineState: OnlineState = {
    state,
    myColor,
    isMyTurn,
    lastError,
    isWaitingForOpponent
  };

  return { ...onlineState, sendMove, endTurn };
};
