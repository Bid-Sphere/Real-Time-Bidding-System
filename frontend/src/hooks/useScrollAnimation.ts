import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  /**
   * Threshold for when the animation should trigger (0-1)
   * 0 = as soon as any part is visible
   * 1 = when entire element is visible
   * @default 0.1
   */
  threshold?: number;
  
  /**
   * Root margin for the intersection observer
   * Negative values trigger animation before element enters viewport
   * Positive values trigger after element enters viewport
   * @default '-100px'
   */
  rootMargin?: string;
  
  /**
   * Whether the animation should only trigger once
   * @default true
   */
  triggerOnce?: boolean;
  
  /**
   * Delay before animation starts (in milliseconds)
   * @default 0
   */
  delay?: number;
}

interface UseScrollAnimationReturn {
  /**
   * Ref to attach to the element you want to animate
   */
  ref: React.RefObject<HTMLElement | null>;
  
  /**
   * Whether the element is currently in view
   */
  isInView: boolean;
  
  /**
   * Whether the element has been viewed at least once
   */
  hasBeenViewed: boolean;
}

/**
 * Custom hook for scroll-triggered fade-in animations using IntersectionObserver
 * 
 * @example
 * ```tsx
 * const { ref, isInView } = useScrollAnimation({ threshold: 0.2 });
 * 
 * return (
 *   <div
 *     ref={ref}
 *     className={`transition-all duration-600 ${
 *       isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
 *     }`}
 *   >
 *     Content
 *   </div>
 * );
 * ```
 */
export const useScrollAnimation = (
  options: UseScrollAnimationOptions = {}
): UseScrollAnimationReturn => {
  const {
    threshold = 0.1,
    rootMargin = '-100px',
    triggerOnce = true,
    delay = 0,
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasBeenViewed, setHasBeenViewed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: immediately show content if IntersectionObserver is not supported
      setIsInView(true);
      setHasBeenViewed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Apply delay if specified
            if (delay > 0) {
              setTimeout(() => {
                setIsInView(true);
                setHasBeenViewed(true);
              }, delay);
            } else {
              setIsInView(true);
              setHasBeenViewed(true);
            }

            // Unobserve if triggerOnce is true
            if (triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            // Reset animation when element leaves viewport (only if triggerOnce is false)
            setIsInView(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    // Cleanup
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce, delay]);

  return {
    ref,
    isInView,
    hasBeenViewed,
  };
};

/**
 * Variant of useScrollAnimation that returns animation classes for common fade-in effects
 * 
 * @example
 * ```tsx
 * const { ref, animationClasses } = useScrollAnimationClasses();
 * 
 * return <div ref={ref} className={animationClasses}>Content</div>;
 * ```
 */
export const useScrollAnimationClasses = (
  options: UseScrollAnimationOptions = {},
  animationType: 'fade' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' = 'fade-up'
) => {
  const { ref, isInView } = useScrollAnimation(options);

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-600 ease-out';
    
    const animations = {
      'fade': {
        visible: 'opacity-100',
        hidden: 'opacity-0',
      },
      'fade-up': {
        visible: 'opacity-100 translate-y-0',
        hidden: 'opacity-0 translate-y-12',
      },
      'fade-down': {
        visible: 'opacity-100 translate-y-0',
        hidden: 'opacity-0 -translate-y-12',
      },
      'fade-left': {
        visible: 'opacity-100 translate-x-0',
        hidden: 'opacity-0 translate-x-12',
      },
      'fade-right': {
        visible: 'opacity-100 translate-x-0',
        hidden: 'opacity-0 -translate-x-12',
      },
    };

    const animation = animations[animationType];
    const stateClasses = isInView ? animation.visible : animation.hidden;

    return `${baseClasses} ${stateClasses}`;
  };

  return {
    ref,
    isInView,
    animationClasses: getAnimationClasses(),
  };
};
