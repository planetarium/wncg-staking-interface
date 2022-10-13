import { Controller } from 'react-hook-form'
import type { Control, RegisterOptions } from 'react-hook-form'
import clsx from 'clsx'

import { useAccount } from 'hooks'

import { StyledInputControl } from './styled'
import type { InputSize } from './styled'
import BaseInput from './BaseInput'
import ErrorMessage from './ErrorMessage'

type InputControlProps = {
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

function InputControl({
  control,
  name,
  rules,
  setMaxValue,
  className,
  decimals = 18,
  disabled: _disabled = false,
  id,
  placeholder,
  $size = 'sm',
}: InputControlProps) {
  const { isConnected } = useAccount()

  const disabled = !isConnected || _disabled

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <StyledInputControl className={clsx('inputControl', className)}>
          <BaseInput
            id={id}
            decimals={decimals}
            field={field}
            setMaxValue={setMaxValue}
            disabled={disabled}
            placeholder={placeholder}
            $error={!disabled && !!fieldState.error?.message}
            $size={$size}
          />
          <ErrorMessage disabled={disabled} error={fieldState.error?.message} />
        </StyledInputControl>
      )}
    />
  )
}

export default InputControl
