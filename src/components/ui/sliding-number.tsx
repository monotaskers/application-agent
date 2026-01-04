/**
 * @fileoverview Sliding number component with animated transitions
 * @module components/ui/sliding-number
 */

"use client";

import { ReactElement, useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";

interface SlidingNumberProps {
  /** The numeric value to display */
  value: number;
  /** Optional className for styling */
  className?: string;
  /** Duration of the animation in seconds */
  duration?: number;
  /** Decimal places to display */
  decimals?: number;
  /** Prefix to display before the number */
  prefix?: string;
  /** Suffix to display after the number */
  suffix?: string;
}

/**
 * SlidingNumber Component
 *
 * Displays a number with a smooth sliding animation when the value changes.
 * The number animates smoothly from the previous value to the new value.
 *
 * @component
 * @param props - Component props
 * @param props.value - The numeric value to display
 * @param props.className - Optional className for styling
 * @param props.duration - Duration of the animation in seconds (default: 0.6)
 * @param props.decimals - Decimal places to display (default: 0)
 * @param props.prefix - Prefix to display before the number
 * @param props.suffix - Suffix to display after the number
 * @returns React element displaying animated number
 *
 * @example
 * ```tsx
 * <SlidingNumber value={84} />
 * <SlidingNumber value={67.5} decimals={1} />
 * <SlidingNumber value={100} prefix="$" suffix="%" />
 * ```
 */
export function SlidingNumber({
  value,
  className,
  duration = 0.6,
  decimals = 0,
  prefix,
  suffix,
}: SlidingNumberProps): ReactElement {
  const motionValue = useMotionValue(value);
  const spring = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
  });
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useMotionValueEvent(spring, "change", (latest) => {
    setDisplayValue(latest);
  });

  // Format the number with decimals
  const formatNumber = (num: number): string => {
    return num.toFixed(decimals);
  };

  return (
    <span className={cn("inline-block tabular-nums", className)}>
      {prefix && <span>{prefix}</span>}
      <motion.span
        key={`${Math.floor(value)}-${value}`}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{
          duration: duration,
          ease: "easeOut",
        }}
      >
        {formatNumber(displayValue)}
      </motion.span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}

