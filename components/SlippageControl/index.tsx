import { MouseEvent, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useAtomValue } from 'jotai'
import clsx from 'clsx'

import { slippageAtom } from 'states/system'
import { useAuth } from 'hooks'

import { StyledSlippageControl } from './styled'
import Menu from './Menu'
import Toggle from './Toggle'

type SlippageControlProps = {
  className?: string
  disabled?: boolean
}

function SlippageControl({ className, disabled }: SlippageControlProps) {
  const { isConnected } = useAuth()

  const [show, setShow] = useState(false)
  const menuRef = useRef<HTMLUListElement>(null)

  const slippage = useAtomValue(slippageAtom) ?? '0.5'

  function toggle(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    if (disabled) return
    setShow((prev) => !prev)
  }

  function closeMenu() {
    setShow(false)
  }

  const showMenu = !!isConnected && show

  return (
    <StyledSlippageControl
      className={clsx('slippageControl', className)}
      $open={show}
    >
      <Toggle
        show={show}
        toggle={toggle}
        value={slippage}
        disabled={disabled || !isConnected}
      />

      <AnimatePresence>
        {showMenu && <Menu menuRef={menuRef} closeMenu={closeMenu} />}
      </AnimatePresence>
    </StyledSlippageControl>
  )
}

export default SlippageControl
