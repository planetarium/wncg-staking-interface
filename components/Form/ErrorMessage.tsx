import { AnimatePresence } from 'framer-motion'

import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'

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
          variants={ANIMATION_MAP.slideInDown}
          layout
        >
          {icon && <Icon icon="warning" />}
          {error}
        </StyledErrorMessage>
      )}
    </AnimatePresence>
  )
}

export default ErrorMessage
