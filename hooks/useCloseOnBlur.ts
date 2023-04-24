import { RefObject, useCallback } from 'react'
import { useMount, useUnmount } from 'react-use'

export function useCloseOnBlur(
  ref: RefObject<HTMLElement>,
  onClose: () => void
) {
  const closeOnBlur = useCallback(
    (e: MouseEvent) => {
      if (!ref?.current?.contains(e.target as Node)) {
        onClose()
        window.removeEventListener('click', closeOnBlur)
      }
    },
    [onClose, ref]
  )

  useMount(() => {
    window.addEventListener('click', closeOnBlur, { passive: false })
  })

  useUnmount(() => {
    window.removeEventListener('click', closeOnBlur)
  })
}
