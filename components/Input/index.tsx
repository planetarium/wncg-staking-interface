import { Control, Controller, RegisterOptions } from 'react-hook-form'

import { BaseInput } from './BaseInput'

type InputProps = {
  control: Control
  name: string
  rules: Partial<RegisterOptions>
  setMaxValue(): void
  className?: string
  disabled?: boolean
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
            field={field}
            fieldState={fieldState}
            precision={precision}
            setMaxValue={setMaxValue}
            disabled={disabled}
            maxButtonDisabled={maxButtonDisabled}
            placeholder={placeholder}
          />
        )}
        rules={rules}
      />
    </div>
  )
}
