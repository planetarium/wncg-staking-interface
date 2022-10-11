import { memo, Suspense, useState } from 'react'
import type { MouseEvent } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'

import { useAccount } from 'hooks'

import Connect from './Connect'
import Toggle from './Toggle'

const Menu = dynamic(() => import('./Menu'), {
  suspense: true,
})

const motionVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
}

const StyledAccountDropdown = styled(motion.div)`
  position: relative;

  button {
    color: white;
  }
`

function AccountDropdown() {
  const [showMenu, setShowMenu] = useState(false)

  const { isConnected, isDisconnected } = useAccount()

  function close() {
    setShowMenu(false)
  }

  function toggle(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    setShowMenu((prev) => !prev)
  }

  return (
    <AnimatePresence>
      <div className="account">
        {isConnected && (
          <StyledAccountDropdown
            className="accountDropdown"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={motionVariants}
          >
            <AnimatePresence>
              {showMenu && (
                <Suspense>
                  <Menu close={close} />
                </Suspense>
              )}
            </AnimatePresence>
            <Toggle toggle={toggle} />
          </StyledAccountDropdown>
        )}

        {isDisconnected && <Connect />}
      </div>
    </AnimatePresence>
  )
}

export default memo(AccountDropdown)
