import { memo, Suspense, useState } from 'react'
import type { MouseEvent } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'

import { appearInDown } from 'constants/motionVariants'
import { useAccount } from 'hooks'

import Toggle from './Toggle'

const Menu = dynamic(() => import('./Menu'), {
  suspense: true,
})

const StyledActionDropdown = styled(motion.div)`
  position: relative;
`

function ActionDropdown() {
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
      {isConnected && (
        <StyledActionDropdown
          className="actionDropdown"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={appearInDown}
        >
          <AnimatePresence>
            {show && (
              <Suspense>
                <Menu close={close} />
              </Suspense>
            )}
          </AnimatePresence>
          <Toggle toggle={toggle} />
        </StyledActionDropdown>
      )}
    </AnimatePresence>
  )
}

export default memo(ActionDropdown)
