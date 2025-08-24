import type { DependencyList } from "react"
import { useEffect } from "react"

export function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  deps?: DependencyList
) {
  useEffect(() => {
    const t = setTimeout(() => {
      // eslint-disable-next-line prefer-spread
      fn.apply(undefined, deps)
    }, waitTime)

    return () => {
      clearTimeout(t)
    }
  }, [deps, fn, waitTime])
}
