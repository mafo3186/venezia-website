import assert from "assert";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Custom hook for calculating and updating the dynamic resolution (dpr) factor.
 * 
 * Algorithm:
 * 1. Sample n frames
 * 2. Take the median of the frame times
 * 3. Use the current DPR & the frame time to calculate the _throughput_
 * 4. Solve that equation for DPR assuming that the frame time is the target frame time
 * 
 * Because the frame rate is capped by the browser, the frame time will never be lower than the target frame time.
 * And therefore the throughput can be lower than what the hardware is actually capable of.
 * So a bias is introduced that ensures that the system always tries to distribute a bit more work
 * than what it observed in the last frame.
 * This is to prevent the resolution from slowly creeping down, because the system _feels_ comfortable at
 * delivering the target frame rate at the lowest resolution.
 * 
 * @param minDpr - The minimum dynamic resolution factor (default: 0.2).
 * @param baseDpr - The initial dynamic resolution factor (default: (minDpr + maxDpr) / 2).
 * @param maxDpr - The maximum dynamic resolution factor (default: 1.2).
 * @param interval - The amound of frames to sample before updating the dynamic resolution factor (default: 7).
 *  High values lead to a slower response, but more stable results.
 * @param optimism - A bias in milliseconds that is subtracted from the measured time. (default: 0.1).
 *  High values lead to a faster recovery after a resolution drop from a spike, but can also cause an instable framerate or even oscillations.
 *  Too low values can cause the resolution to slowly creep down. 
 * @returns The current dynamic resolution value.
 */
export default function useDynamicRes({ targetFrameRate = 60, minDpr = 0.25, baseDpr, maxDpr = 1.2, interval = 7, optimism = 0.1 }: { targetFrameRate?: number, minDpr?: number, baseDpr?: number, maxDpr?: number, interval?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, optimism?: number } = {}): number {
  assert(targetFrameRate > 0, "targetFrameRate must be greater than 0");
  assert(minDpr < maxDpr, "minDpr must be smaller than maxDpr");
  assert(minDpr > 0, "minDpr must be greater than 0");
  assert(maxDpr > 0, "maxDpr must be greater than 0");
  assert(optimism >= 0, "optimism must be greater or equal to 0");
  assert(interval > 0, "interval must be greater than 0");
  if (baseDpr) {
    assert(baseDpr >= minDpr && baseDpr <= maxDpr, "baseDpr must be between minDpr and maxDpr");
  }
  const [dpr, setDpr] = useState<number>(baseDpr ?? (minDpr + maxDpr) / 2);
  const samples = useRef<number[]>([]);
  const counter = useRef<number>(0);
  const targetFrameTime = 1000.0 / targetFrameRate;
  const previousTimeRef = useRef<number | undefined>(undefined);
  const streak = useRef<number>(optimism);

  useEffect(() => {
    counter.current = 0;
    samples.current = new Array(interval).fill(0);
  }, [interval]);

  useEffect(() => {
    let animationFrameId = -1;

    const updateFrameTime = (currentTime: number) => {
      if (previousTimeRef.current) {
        const delta = currentTime - previousTimeRef.current;
        samples.current[counter.current] = delta;
        counter.current = (counter.current + 1) % samples.current.length;

        // Update DPR every 10 frames
        if (counter.current === (samples.current.length - 1)) {
          const median = samples.current.sort((a, b) => a - b)[Math.floor(samples.current.length / 2)] - streak.current;

          const throughput = dpr / median;

          const nextDpr = Math.min(maxDpr, Math.max(targetFrameTime * throughput, minDpr));

          // console.log(`median ${median.toFixed(2)}, throughput ${throughput.toFixed(2)}`);
          if (nextDpr !== dpr) {
            // console.log(`delta ${delta.toFixed(2)}, target ${targetFrameTime.current.toFixed(2)}, dpr ${nextDpr}`);
            streak.current = nextDpr > dpr ? streak.current + optimism : optimism;
            setDpr(() => nextDpr);
          }
        }
      }

      previousTimeRef.current = currentTime;
      animationFrameId = requestAnimationFrame(updateFrameTime);
    };

    // Start the loop
    animationFrameId = requestAnimationFrame(updateFrameTime);

    // Cleanup on unmount
    return () => cancelAnimationFrame(animationFrameId);
  }, [dpr, setDpr, minDpr, maxDpr, optimism, targetFrameTime]);

  return dpr;
}
