import type { MouseEvent } from 'react'
import { Control, Controller, RegisterOptions } from 'react-hook-form'
import clsx from 'clsx'

import { useAccount } from 'hooks'

import { StyledInputControl } from './styled'
import type { InputSize } from './styled'
import BaseInput from './BaseInput'
import ErrorMessage from './ErrorMessage'
import RangeInput from './RangeInput'

type InputControlProps = {
  control: Control
  name: string
  rules: Partial<RegisterOptions>
  className?: string
  decimals?: number
  disabled?: boolean
  id?: string
  setMaxValue?(e: MouseEvent<HTMLButtonElement>): void
  type?: 'text' | 'range'
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
  type = 'text',
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
          {type === 'text' ? (
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
          ) : (
            <RangeInput id={id} field={field} disabled={disabled} />
          )}
          <ErrorMessage disabled={disabled} error={fieldState.error?.message} />
        </StyledInputControl>
      )}
    />
  )
}

export default InputControl
