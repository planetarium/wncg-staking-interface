import { memo, MouseEvent, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useAtomValue } from 'jotai'
import clsx from 'clsx'

import { slippageAtom } from 'states/system'

import { StyledSlippageControl } from './styled'
import Menu from './Menu'
import Toggle from './Toggle'

type SlippageControlProps = {
  className?: string
}

function SlippageControl({ className }: SlippageControlProps) {
  const [show, setShow] = useState(false)
  const menuRef = useRef<HTMLUListElement>(null)

  const slippage = useAtomValue(slippageAtom) ?? '0.5'

  function toggle(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    setShow((prev) => !prev)
  }

  function closeMenu() {
    setShow(false)
  }

  return (
    <StyledSlippageControl
      className={clsx('slippageControl', className)}
      $open={show}
    >
      <Toggle show={show} toggle={toggle} value={slippage} />

      <AnimatePresence>
        {show && <Menu menuRef={menuRef} closeMenu={closeMenu} />}
      </AnimatePresence>
    </StyledSlippageControl>
  )
}

export default memo(SlippageControl)
