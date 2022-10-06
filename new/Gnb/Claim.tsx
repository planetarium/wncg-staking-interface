import { memo } from 'react'
import { useAccount } from 'wagmi'
import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'

import { motionVariants } from 'components/home/constants'

const StyledClaim = styled(motion.div)``

function Claim() {
  const { address: account } = useAccount()

  return (
    <AnimatePresence>
      {account && (
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
