import { useEffect, useRef, useState } from "react";
import type { Coord, Player } from "@jumpfrog/rules";
import { JUMP_WINDOW_MS } from "../constants/game";
import { otherPlayer } from "../utils/playerHelpers";

/**
 * Hook to manage jump continuation timer and state
 */
export const useJumpContinuation = (
  onTimerExpire: (nextPlayer: Player) => void,
  currentPlayer: Player
) => {
  const [continuationFrogId, setContinuationFrogId] = useState<string | null>(null);
  const [continuationFromCoord, setContinuationFromCoord] = useState<Coord | null>(null);
  const [jumpTimerMs, setJumpTimerMs] = useState<number | null>(null);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (continuationFrogId === null) return;
    // Initialize timer state when continuation starts
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setJumpTimerMs(JUMP_WINDOW_MS);
    timerRef.current = setInterval(() => {
      setJumpTimerMs((prev) => {
        if (prev === null) return null;
        const next = prev - 100;
        if (next <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          setContinuationFrogId(null);
          setContinuationFromCoord(null);
          onTimerExpire(otherPlayer(currentPlayer));
          return null;
        }
        return next;
      });
    }, 100);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [continuationFrogId, timerResetKey, onTimerExpire, currentPlayer]);

  const startContinuation = (frogId: string, fromCoord: Coord) => {
    setContinuationFrogId(frogId);
    setContinuationFromCoord(fromCoord);
    setTimerResetKey((k) => k + 1);
  };

  const clearContinuation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setContinuationFrogId(null);
    setContinuationFromCoord(null);
    setJumpTimerMs(null);
  };

  const endTurnManually = () => {
    clearContinuation();
    onTimerExpire(otherPlayer(currentPlayer));
  };

  return {
    continuationFrogId,
    continuationFromCoord,
    jumpTimerMs,
    startContinuation,
    clearContinuation,
    endTurnManually
  };
};
