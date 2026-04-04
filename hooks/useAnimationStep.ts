"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface Options {
  totalSteps: number;
  intervalMs?: number;
  loop?: boolean;
}

export function useAnimationStep({ totalSteps, intervalMs = 1000, loop = false }: Options) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    setPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    stop();
    setPlaying(true);
  }, [stop]);

  const reset = useCallback(() => {
    stop();
    setStep(0);
  }, [stop]);

  const next = useCallback(() => {
    setStep((s) => {
      if (s >= totalSteps - 1) return loop ? 0 : s;
      return s + 1;
    });
  }, [totalSteps, loop]);

  const prev = useCallback(() => {
    setStep((s) => (s <= 0 ? 0 : s - 1));
  }, []);

  const goTo = useCallback(
    (n: number) => setStep(Math.max(0, Math.min(n, totalSteps - 1))),
    [totalSteps]
  );

  useEffect(() => {
    if (!playing) return;
    timerRef.current = setInterval(() => {
      setStep((s) => {
        if (s >= totalSteps - 1) {
          if (loop) return 0;
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, totalSteps, intervalMs, loop]);

  return { step, playing, play, stop, reset, next, prev, goTo, totalSteps };
}
