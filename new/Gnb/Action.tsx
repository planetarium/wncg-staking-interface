import { motion } from 'framer-motion'
import { memo } from 'react'
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
  return (
    <StyledAction
      initial="initial"
      animate="animate"
      exit="exit"
      variants={motionVariants}
    >
      Action
    </StyledAction>
  )
}

export default memo(Action)
