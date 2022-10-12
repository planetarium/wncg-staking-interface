import { Control, Controller, RegisterOptions } from 'react-hook-form'

import { StyledInputControl } from './styled'
import type { InputSize } from './styled'
import BaseInput from './BaseInput'
import ErrorMessage from './ErrorMessage'
import { useAccount } from 'hooks'

type InputProps = {
  control: Control
  name: string
  rules: Partial<RegisterOptions>
  setMaxValue(): void
  className?: string
  decimals?: number
  disabled?: boolean
  id?: string
  placeholder?: string
  $size?: InputSize
}

function Input({
  control,
  name,
  rules,
  setMaxValue,
  className,
  decimals = 18,
  disabled: _disabled = false,
  id,
  placeholder: _placeholder,
  $size = 'sm',
}: InputProps) {
  const { isConnected } = useAccount()

  const disabled = !isConnected || _disabled
  const placeholder = disabled ? undefined : _placeholder

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <StyledInputControl className={className}>
          <BaseInput
            id={id}
            decimals={decimals}
            field={field}
            setMaxValue={setMaxValue}
            disabled={disabled}
            placeholder={disabled ? undefined : placeholder}
            $error={!!fieldState.error?.message}
            $size={$size}
          />
          <ErrorMessage error={fieldState.error?.message} />
        </StyledInputControl>
      )}
    />
  )
}

export default Input
