import { useState, useEffect, useRef } from 'react';

interface UseCountUpOptions {
  /**
   * The target number to count up to
   */
  end: number;
  
  /**
   * Starting number (default: 0)
   */
  start?: number;
  
  /**
   * Duration of the animation in milliseconds (default: 2000)
   */
  duration?: number;
  
  /**
   * Whether to start the animation (typically tied to viewport visibility)
   */
  shouldStart?: boolean;
  
  /**
   * Decimal places to show (default: 0)
   */
  decimals?: number;
  
  /**
   * Easing function type (default: 'easeOut')
   */
  easing?: 'linear' | 'easeOut' | 'easeInOut';
}

interface UseCountUpReturn {
  /**
   * Current animated value
   */
  value: number;
  
  /**
   * Formatted value as string
   */
  formattedValue: string;
  
  /**
   * Whether the animation is currently running
   */
  isAnimating: boolean;
  
  /**
   * Whether the animation has completed
   */
  isComplete: boolean;
  
  /**
   * Reset the animation
   */
  reset: () => void;
}

/**
 * Easing functions for smooth animations
 */
const easingFunctions = {
  linear: (t: number) => t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
};

/**
 * Custom hook for animating numbers counting up
 * Triggers animation when section enters viewport
 * 
 * Requirements: 8.4
 * - Animate statistics counting up when the section enters viewport
 * 
 * @example
 * ```tsx
 * const { formattedValue, isComplete } = useCountUp({
 *   end: 1500,
 *   duration: 2000,
 *   shouldStart: isInView,
 * });
 * 
 * return <span>{formattedValue}</span>;
 * ```
 */
export const useCountUp = (options: UseCountUpOptions): UseCountUpReturn => {
  const {
    end,
    start = 0,
    duration = 2000,
    shouldStart = false,
    decimals = 0,
    easing = 'easeOut',
  } = options;

  const [value, setValue] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);

  const easingFn = easingFunctions[easing];

  const formatValue = (num: number): string => {
    const fixed = num.toFixed(decimals);
    // Add thousand separators
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const reset = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setValue(start);
    setIsAnimating(false);
    setIsComplete(false);
    startTimeRef.current = null;
    hasStartedRef.current = false;
  };

  useEffect(() => {
    // Only start animation once when shouldStart becomes true
    if (!shouldStart || hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;
    setIsAnimating(true); // eslint-disable-line react-hooks/set-state-in-effect
    setIsComplete(false); // eslint-disable-line react-hooks/set-state-in-effect

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFn(progress);
      
      const currentValue = start + (end - start) * easedProgress;
      setValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setValue(end);
        setIsAnimating(false);
        setIsComplete(true);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [shouldStart, start, end, duration, easingFn]);

  return {
    value,
    formattedValue: formatValue(value),
    isAnimating,
    isComplete,
    reset,
  };
};

export default useCountUp;
