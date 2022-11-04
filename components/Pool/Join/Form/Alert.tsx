import { memo } from 'react'
import { AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

import { slideInDown } from 'constants/motionVariants'

import { StyledJoinFormAlert } from './styled'
import SvgIcon from 'components/SvgIcon'

type JoinFormAlertProps = {
  message: string
  show: boolean
  className?: string
}

function JoinFormAlert({ message, show, className }: JoinFormAlertProps) {
  return (
    <AnimatePresence>
      {show && (
        <StyledJoinFormAlert
          className={clsx('joinFormAlert', className)}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={slideInDown}
          role="alert"
        >
          <SvgIcon icon="warning" $size={24} />
          <h4 className="title">{message}</h4>
        </StyledJoinFormAlert>
      )}
    </AnimatePresence>
  )
}

export default memo(JoinFormAlert)
