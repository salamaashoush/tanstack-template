import { useEffect, useLayoutEffect } from "react";

/**
 * Custom hook that uses either `useLayoutEffect` or `useEffect` based on the environment (client-side or server-side).
 * @param {Function} effect - The effect function to be executed.
 * @param {Array<any>} [dependencies] - An array of dependencies for the effect (optional).
 * @example
 * ```tsx
 * useIsomorphicEffect(() => {
 *   // Code to be executed during the layout phase on the client side
 * }, [dependency1, dependency2]);
 * ```
 */
export const useIsomorphicEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;