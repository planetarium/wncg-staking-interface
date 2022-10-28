import { useEffect, useState } from 'react'

export function useDebouncedValue<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(id)
    }
  }, [delay, value])

  return debouncedValue
}
