import { memo } from 'react'
import { useAccount } from 'wagmi'
import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'

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
  const { address: account } = useAccount()

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
