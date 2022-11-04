import { memo } from 'react'
import { AnimatePresence } from 'framer-motion'

import { slideInDown } from 'constants/motionVariants'

import { StyledErrorMessage } from './styled'

type ErrorMessageProps = {
  disabled: boolean
  error?: string
}

function ErrorMessage({ disabled, error }: ErrorMessageProps) {
  const hasError = !disabled && !!error

  return (
    <AnimatePresence>
      {hasError && (
        <StyledErrorMessage
          className="errorMsg"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={slideInDown}
        >
          {error}
        </StyledErrorMessage>
      )}
    </AnimatePresence>
  )
}

export default memo(ErrorMessage)
