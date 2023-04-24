import { useCallback, useState } from 'react'
import { useUnmount } from 'react-use'

export function useCopy(delay = 750) {
  const [copied, setCopied] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>()

  const onCopy = useCallback(() => {
    if (timeoutId) clearTimeout(timeoutId)

    setCopied(true)

    const id = setTimeout(() => {
      setCopied(false)
    }, delay)

    setTimeoutId(id)
  }, [delay, timeoutId])

  useUnmount(() => {
    if (timeoutId) clearTimeout(timeoutId)
  })

  return {
    copied,
    onCopy,
  }
}
