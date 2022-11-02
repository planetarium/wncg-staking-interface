import { memo } from 'react'
import { AnimatePresence } from 'framer-motion'

import { slideInDown } from 'constants/motionVariants'

import { StyledJoinFormWarning } from './styled'
import SvgIcon from 'new/SvgIcon'

type JoinFormWarningProps = {
  show: boolean
}

function JoinFormWarning({ show }: JoinFormWarningProps) {
  return (
    <AnimatePresence>
      {show && (
        <StyledJoinFormWarning
          className="joinFormWarning"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={slideInDown}
          role="alert"
        >
          <SvgIcon icon="warning" />
          <h4 className="title">
            To ensure a smooth transaction, <strong>at least 0.05 ETH</strong>{' '}
            must be left in your wallet to pay for gas fees.
          </h4>
        </StyledJoinFormWarning>
      )}
    </AnimatePresence>
  )
}

export default memo(JoinFormWarning)
