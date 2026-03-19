import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Custom hook to manage GSAP animations within React functional components.
 * Automatically handles GSAP context creation and cleanup to prevent memory leaks and duplicate tweens on hot-reloading.
 *
 * @param callback The GSAP animation logic.
 * @param dependencies React dependency array to trigger re-animations.
 */
export function useGSAP(callback: () => void, dependencies: any[] = []) {
  const contextRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => {
    contextRef.current = gsap.context(() => {
      callback();
    });

    // Cleanup function reverts all animations created within this context
    return () => {
      if (contextRef.current) {
        contextRef.current.revert();
      }
    };
  }, dependencies);

  return contextRef;
}
