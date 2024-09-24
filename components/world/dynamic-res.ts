import { min } from "date-fns";
import Controller from "node-pid-controller";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Custom hook for calculating and updating the dynamic resolution (dpr) factor
 * using a PID controller.
 * 
 * @param minDpr - The minimum dynamic resolution factor (default: 0.2).
 * @param maxDpr - The maximum dynamic resolution factor (default: 1.2).
 * @returns The current dynamic resolution value.
 */
export default function useDynamicRes(minDpr: number = 0.2, maxDpr: number = 1.2): number {
  const [dpr, setDpr] = useState<number>((minDpr + maxDpr) / 2);

  const pid = useMemo(() => {
    const controller = new Controller(0.07, 0.05, 0.01);
    controller.setTarget(1000 / 60);
    return controller;
  }, []);

  const previousTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let animationFrameId = -1;

    const updateFrameTime = (currentTime: number) => {
      if (previousTimeRef.current != null) {
        const delta = currentTime - previousTimeRef.current;
        if (delta < pid.target && delta > 0.1) {
          pid.setTarget(delta);
        }
        const correction = pid.update(delta);

        const nextDpr = Math.min(maxDpr, Math.max(dpr - correction, minDpr));
        // console.log(`delta ${delta.toFixed(2)}, target ${pid.target.toFixed(2)}, correction ${correction.toFixed(2)}, dpr ${nextDpr}`);
        if (nextDpr !== dpr) {
          setDpr(() => nextDpr);
        }
      }
      previousTimeRef.current = currentTime;
      animationFrameId = requestAnimationFrame(updateFrameTime);
    };

    // Start the loop
    animationFrameId = requestAnimationFrame(updateFrameTime);

    // Cleanup on unmount
    return () => cancelAnimationFrame(animationFrameId);
  }, [pid, dpr, setDpr, minDpr, maxDpr]);

  return dpr;
}
