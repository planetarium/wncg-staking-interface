import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

type ModalPortalProps = {
  children: ReactNode
}

const ModalPortal = ({ children }: ModalPortalProps) => {
  if (
    !children ||
    typeof window === 'undefined' ||
    typeof document === 'undefined'
  ) {
    return null
  }

  return createPortal(children, document.getElementById('modal')!)
}

export default ModalPortal
