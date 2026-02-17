import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { Coord } from "@jumpfrog/rules";

/**
 * Hook to measure board cell size and calculate cell center positions
 */
export const useBoardMeasurement = () => {
  const [cellSize, setCellSize] = useState(0);
  const boardRef = useRef<HTMLDivElement | null>(null);

  const updateCellSize = useCallback(() => {
    if (!boardRef.current) {
      return;
    }

    const rect = boardRef.current.getBoundingClientRect();
    const styles = window.getComputedStyle(boardRef.current);
    const padX =
      parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
    const padY =
      parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
    const innerWidth = rect.width - padX;
    const innerHeight = rect.height - padY;
    setCellSize(Math.min(innerWidth / 8, innerHeight / 8));
  }, []);

  useLayoutEffect(() => {
    updateCellSize();
    window.addEventListener("resize", updateCellSize);
    return () => window.removeEventListener("resize", updateCellSize);
  }, [updateCellSize]);

  const cellCenter = useCallback(
    (coord: Coord) => {
      if (!boardRef.current || cellSize === 0) {
        return null;
      }

      const rect = boardRef.current.getBoundingClientRect();
      const styles = window.getComputedStyle(boardRef.current);
      const padLeft = parseFloat(styles.paddingLeft);
      const padTop = parseFloat(styles.paddingTop);

      return {
        x: rect.left + padLeft + (coord.c + 0.5) * cellSize,
        y: rect.top + padTop + (coord.r + 0.5) * cellSize
      };
    },
    [cellSize]
  );

  return { cellSize, boardRef, cellCenter, updateCellSize };
};
