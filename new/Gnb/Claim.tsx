import { memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'

import { ModalCategory } from 'states/ui'
import { useAccount, useModal } from 'hooks'

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

const StyledClaim = styled(motion.button)`
  position: absolute;
  top: 50%;
  left: 50%;
  height: 40px;
  padding: 0 8px;
  background-color: #fff;
  transform: translate(-50%, -50%);
`

function Claim() {
  const { isConnected } = useAccount()
  const { addModal } = useModal()

  function claim() {
    addModal({
      category: ModalCategory.ClaimReward,
    })
  }

  return (
    <AnimatePresence>
      {isConnected && (
        <StyledClaim
          className="claimDropdown"
          type="button"
          onClick={claim}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={motionVariants}
        >
          Claim
        </StyledClaim>
      )}
    </AnimatePresence>
  )
}

export default memo(Claim)
