import type { ControllerRenderProps, FieldValues } from 'react-hook-form'

import { StyledBaseInput } from './styled'

type TextInputProps = {
  disabled: boolean
  field: ControllerRenderProps<FieldValues>
  id?: string
  onClick?(): void
  placeholder?: string
  $error: boolean
  $size: InputSize
}

export default function TextInput({
  disabled,
  field,
  id,
  onClick,
  placeholder,
  $error,
  $size,
}: TextInputProps) {
  const { ref, ...fieldProps } = field

  return (
    <StyledBaseInput
      className="baseInput"
      $disabled={disabled}
      $error={$error}
      $size={$size}
      $text
    >
      <input
        {...fieldProps}
        id={id}
        className="input"
        type="text"
        disabled={disabled}
        onClick={onClick}
        placeholder={placeholder}
        autoComplete="off"
      />
    </StyledBaseInput>
  )
}
