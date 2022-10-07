import { memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'

import { motionVariants } from 'components/home/constants'
import { useAccount } from 'hooks'

const StyledClaim = styled(motion.div)``

function Claim() {
  const { isConnected } = useAccount()

  return (
    <AnimatePresence>
      {isConnected && (
        <StyledClaim
          initial="initial"
          animate="animate"
          exit="exit"
          variants={motionVariants}
        >
          Action
        </StyledClaim>
      )}
    </AnimatePresence>
  )
}

export default memo(Claim)
