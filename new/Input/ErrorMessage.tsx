import { memo } from 'react'
import { AnimatePresence } from 'framer-motion'

import { StyledErrorMessage } from './styled'

const motionVariants = {
  initial: {
    opacity: 0,
    y: '-100%',
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: '-100%',
  },
}

type ErrorMessageProps = {
  error?: string
}

function ErrorMessage({ error }: ErrorMessageProps) {
  const hasError = !!error

  return (
    <AnimatePresence>
      {hasError && (
        <StyledErrorMessage
          className="errorMsg"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={motionVariants}
        >
          {error}
        </StyledErrorMessage>
      )}
    </AnimatePresence>
  )
}

export default memo(ErrorMessage)
