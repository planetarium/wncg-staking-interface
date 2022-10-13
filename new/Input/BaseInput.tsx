import type { ControllerRenderProps, FieldValues } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'

import { StyledBaseInput } from './styled'
import type { InputSize } from './styled'

type BaseInputProps = {
  decimals: number
  disabled: boolean
  field: ControllerRenderProps<FieldValues>
  setMaxValue(): void
  id?: string
  placeholder?: string
  $error: boolean
  $size: InputSize
}

function BaseInput({
  decimals,
  disabled,
  field,
  setMaxValue,
  id,
  placeholder,
  $error,
  $size,
}: BaseInputProps) {
  const { ref, ...fieldProps } = field

  return (
    <StyledBaseInput
      className="baseInput"
      $disabled={disabled}
      $error={$error}
      $size={$size}
    >
      <NumericFormat
        {...fieldProps}
        id={id}
        className="input"
        allowNegative={false}
        decimalScale={decimals}
        valueIsNumericString
        thousandSeparator={true}
        disabled={disabled}
        placeholder={placeholder}
      />
      <button
        className="maxButton"
        type="button"
        onClick={setMaxValue}
        disabled={disabled}
        aria-label="Enter maximum value"
      >
        max
      </button>
    </StyledBaseInput>
  )
}

export default BaseInput
