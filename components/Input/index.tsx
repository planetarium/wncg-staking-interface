import { Control, Controller, RegisterOptions } from 'react-hook-form'

import { BaseInput } from './BaseInput'

type InputProps = {
  control: Control
  name: string
  rules: Partial<RegisterOptions>
  setMaxValue(): void
  className?: string
  disabled?: boolean
  id?: string
  maxButtonDisabled?: boolean
  placeholder?: string
  precision?: number
}

export function Input({
  control,
  name,
  rules,
  setMaxValue,
  className,
  disabled,
  id,
  maxButtonDisabled,
  placeholder,
  precision = 18,
}: InputProps) {
  return (
    <div className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <BaseInput
            id={id}
            field={field}
            fieldState={fieldState}
            precision={precision}
            setMaxValue={setMaxValue}
            disabled={disabled}
            maxButtonDisabled={disabled || maxButtonDisabled}
            placeholder={disabled ? undefined : placeholder}
          />
        )}
        rules={rules}
      />
    </div>
  )
}
