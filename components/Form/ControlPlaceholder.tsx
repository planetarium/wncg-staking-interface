import { NumericFormat } from 'react-number-format'
import clsx from 'clsx'

import { StyledBaseInput, StyledFormControl, StyledNumberInput } from './styled'

type FormControlPlaceholder = {
  className?: string
  label?: string
  placeholder?: string
  type?: 'number' | 'text'
  $size?: InputSize
}

export default function FormControlPlaceholder({
  className,
  label,
  placeholder,
  type = 'number',
  $size = 'lg',
}: FormControlPlaceholder) {
  return (
    <StyledFormControl className={clsx('inputControl', className)} $disabled>
      {label && <span className="label">{label}</span>}

      {type === 'number' ? (
        <StyledNumberInput
          className="baseInput"
          $disabled
          $error={false}
          $size={$size}
          $focused={false}
        >
          <NumericFormat
            className="input"
            allowNegative={false}
            placeholder={placeholder}
            disabled
          />
          <button
            className="maxButton"
            type="button"
            disabled
            aria-label="Enter maximum value"
          >
            max
          </button>
        </StyledNumberInput>
      ) : (
        <StyledBaseInput
          className="baseInput"
          placeholder={placeholder}
          $disabled
          $error={false}
          $size={$size}
          $text
        >
          <input
            className="input"
            type="text"
            disabled
            placeholder={placeholder}
            autoComplete="off"
          />
        </StyledBaseInput>
      )}
    </StyledFormControl>
  )
}
