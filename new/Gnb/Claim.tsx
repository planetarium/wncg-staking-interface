import { memo } from 'react'
import { useRecoilValue } from 'recoil'
import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'

import { accountState } from 'app/states/connection'
import { motionVariants } from 'components/home/constants'

const StyledClaim = styled(motion.div)``

function Claim() {
  const account = useRecoilValue(accountState)

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
