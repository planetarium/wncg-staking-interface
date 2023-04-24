import { memo } from 'react'
import { AnimatePresence } from 'framer-motion'

import { EXIT_MOTION } from 'config/motions'
import { slideInDown } from 'config/motionVariants'

import { StyledErrorMessage } from './styled'
import Icon from 'components/Icon'

type ErrorMessageProps = {
  disabled: boolean
  error?: string
  icon?: boolean
}

function ErrorMessage({ disabled, error, icon = false }: ErrorMessageProps) {
  const hasError = !disabled && !!error

  return (
    <AnimatePresence>
      {hasError && (
        <StyledErrorMessage
          {...EXIT_MOTION}
          className="errorMsg"
          variants={slideInDown}
          layout
        >
          {icon && <Icon icon="warning" />}
          {error}
        </StyledErrorMessage>
      )}
    </AnimatePresence>
  )
}

export default memo(ErrorMessage)
