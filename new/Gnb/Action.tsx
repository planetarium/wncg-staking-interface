import { memo } from 'react'
import { useRecoilValue } from 'recoil'
import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'

import { accountState } from 'app/states/connection'

const StyledAction = styled(motion.div)`
  background-color: blue;
  color: white;
`

const motionVariants = {
  initial: {
    y: '-100%',
  },
  animate: {
    y: 0,
  },
  exit: {
    y: '-100%',
  },
}

function Action() {
  const account = useRecoilValue(accountState)

  return (
    <AnimatePresence>
      {account && (
        <StyledAction
          initial="initial"
          animate="animate"
          exit="exit"
          variants={motionVariants}
        >
          Action
        </StyledAction>
      )}
    </AnimatePresence>
  )
}

export default memo(Action)
