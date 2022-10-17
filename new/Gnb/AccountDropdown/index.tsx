import { memo, Suspense, useState } from 'react'
import type { MouseEvent } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'

import { fadeIn } from 'constants/motionVariants'
import { useAccount } from 'hooks'

import Connect from './Connect'
import Toggle from './Toggle'

const Menu = dynamic(() => import('./Menu'), {
  suspense: true,
})

const StyledAccountDropdown = styled(motion.div)`
  position: relative;
  flex-shrink: 0;
  margin-left: 16px;
`

function AccountDropdown() {
  const [show, setShow] = useState(false)

  const { isConnected } = useAccount()

  function close() {
    setShow(false)
  }

  function toggle(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    setShow((prev) => !prev)
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
            variants={fadeIn}
          >
            <AnimatePresence>
              {show && (
                <Suspense>
                  <Menu close={close} />
                </Suspense>
              )}
            </AnimatePresence>
            <Toggle toggle={toggle} />
          </StyledAccountDropdown>
        )}

        {!isConnected && <Connect />}
      </div>
    </AnimatePresence>
  )
}

export default memo(AccountDropdown)
