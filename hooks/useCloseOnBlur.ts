import { RefObject, useCallback } from 'react'
import { useMount, useUnmount } from 'react-use'

type CloseOnBlurOptions = {
  capture?: boolean
  passive?: boolean
}

export function useCloseOnBlur(
  ref: RefObject<HTMLElement>,
  onClose: () => void,
  options: CloseOnBlurOptions = {}
) {
  const { capture = true, passive = true } = options

  const closeOnBlur = useCallback(
    (e: MouseEvent) => {
      if (!ref?.current?.contains(e.target as Node)) {
        onClose()
        window.removeEventListener('click', closeOnBlur, {
          capture,
        })
      }
    },
    [capture, onClose, ref]
  )

  useMount(() => {
    window.addEventListener('click', closeOnBlur, {
      capture,
      passive,
    })
  })

  useUnmount(() => {
    window.removeEventListener('click', closeOnBlur)
  })
}
