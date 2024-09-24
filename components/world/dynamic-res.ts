import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Custom hook for calculating and updating the dynamic resolution (dpr) factor.
 * 
 * Algorithm:
 * 1. Sample 10 Frames
 * 2. Take the median of the frame times
 * 3. Use the current DPR & the frame time to calculate the _throughput_
 * 4. Solve that equation for DPR assuming that the frame time is the target frame time
 * 
 * @param minDpr - The minimum dynamic resolution factor (default: 0.2).
 * @param maxDpr - The maximum dynamic resolution factor (default: 1.2).
 * @returns The current dynamic resolution value.
 */
export default function useDynamicRes(minDpr: number = 0.25, maxDpr: number = 1.2): number {
  const [dpr, setDpr] = useState<number>((minDpr + maxDpr) / 2);
  const samples = useRef<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const counter = useRef<number>(0);
  const targetFrameTime = useRef<number>(1000.0 / 60.0);
  const previousTimeRef = useRef<number | undefined>(undefined);

  // Bias to prevent the resolution from slowly creeping down,
  // when the measured frame time cannot reach the target frame time
  // due to measurement inaccuracies.
  const BIAS = .1;

  useEffect(() => {
    let animationFrameId = -1;

    const updateFrameTime = (currentTime: number) => {
      if (previousTimeRef.current) {
        const delta = currentTime - previousTimeRef.current;
        samples.current[counter.current] = delta;
        counter.current = (counter.current + 1) % samples.current.length;

        // Update DPR every 10 frames
        if (counter.current === (samples.current.length - 1)) {
          const median = samples.current.sort((a, b) => a - b)[Math.floor(samples.current.length / 2)] - BIAS;

          const throughput = dpr / median;

          const nextDpr = Math.min(maxDpr, Math.max(targetFrameTime.current * throughput, minDpr));
          
          // console.log(`median ${median.toFixed(2)}, throughput ${throughput.toFixed(2)}`);
          if (nextDpr !== dpr) {
            // console.log(`delta ${delta.toFixed(2)}, target ${targetFrameTime.current.toFixed(2)}, dpr ${nextDpr}`);
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
  }, [dpr, setDpr, minDpr, maxDpr]);

  return dpr;
}
