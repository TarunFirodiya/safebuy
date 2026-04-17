"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import useMeasure from "react-use-measure";
import { cn } from "@/lib/utils";

interface InfiniteSliderProps {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  reverse?: boolean;
  className?: string;
}

export function InfiniteSlider({
  children,
  gap = 48,
  duration = 40,
  durationOnHover,
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [currentDuration, setCurrentDuration] = useState(duration);
  const [ref, { width }] = useMeasure();
  const x = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (width === 0) return;
    const contentSize = width + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;

    const controls = isTransitioning
      ? animate(x, [x.get(), to], {
          ease: "linear",
          duration: currentDuration * Math.abs((x.get() - to) / contentSize),
          onComplete: () => {
            setIsTransitioning(false);
            setKey((k) => k + 1);
          },
        })
      : animate(x, [from, to], {
          ease: "linear",
          duration: currentDuration,
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 0,
          onRepeat: () => x.set(from),
        });

    return () => controls.stop();
  }, [key, x, currentDuration, width, gap, isTransitioning, reverse]);

  const hoverProps = durationOnHover
    ? {
        onHoverStart: () => { setIsTransitioning(true); setCurrentDuration(durationOnHover); },
        onHoverEnd:   () => { setIsTransitioning(true); setCurrentDuration(duration); },
      }
    : {};

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        ref={ref}
        className="flex w-max"
        style={{ x, gap }}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
