import { FocusEvent, MouseEvent, useCallback } from 'react'
import { Control, Controller, RegisterOptions } from 'react-hook-form'
import clsx from 'clsx'

import { StyledFormControl } from './styled'
import ErrorMessage from './ErrorMessage'
import NumberInput from './NumberInput'
import RangeInput from './RangeInput'
import TextInput from './TextInput'

type CommonProps = {
  control: Control
  id: string
  name: string
  rules: Partial<RegisterOptions>
  className?: string
  defaultValue?: string | number
  disabled?: boolean
  label?: string
  placeholder?: string
  onClick?(): void
  type?: 'text' | 'number' | 'range'
  $size?: InputSize
}

type ConditionalProps<T> = T extends 'text'
  ? {
      address?: never
      setMaxValue?: never
      decimals?: never
      maxAmount?: never
      onMaxButtonBlur?: never
      showFiatValue?: never
      min?: never
      max?: never
      step?: never
    }
  : T extends 'number'
  ? {
      setMaxValue(e: MouseEvent<HTMLButtonElement>): void
      address?: Hash
      decimals?: number
      showFiatValue?: boolean
      maxAmount?: string
      onMaxButtonBlur?(e: FocusEvent): void
      min?: never
      max?: never
      step?: never
    }
  : {
      address?: never
      showFiatValue?: never
      setMaxValue?: never
      decimals?: never
      maxAmount?: never
      onMaxButtonBlur?: never
      placeholder?: never
      min: number
      max: number
      step: number
    }

type FormControlProps<T> = CommonProps & ConditionalProps<T>

export default function FormControl<T>({
  address,
  control,
  id,
  name,
  rules,
  setMaxValue,
  showFiatValue,
  className,
  decimals = 18,
  disabled = false,
  label,
  onClick,
  onMaxButtonBlur,
  placeholder,
  min,
  max,
  step,
  type = 'number',
  $size = 'lg',
}: FormControlProps<T>) {
  const renderer = useCallback(
    ({ field, fieldState }: ControlRendererProps<any>) => {
      const $error = !disabled && !!fieldState.error?.message

      return (
        <StyledFormControl
          className={clsx('inputControl', className)}
          transition={{ easing: 'linear' }}
          $disabled={disabled}
        >
          {label && (
            <label className="label" htmlFor={id}>
              {label}
            </label>
          )}

          {type === 'text' ? (
            <TextInput
              id={id}
              field={field}
              disabled={disabled}
              placeholder={placeholder}
              onClick={onClick}
              $error={$error}
              $size={$size}
            />
          ) : type === 'number' ? (
            <NumberInput
              id={id}
              address={address}
              decimals={decimals}
              field={field}
              setMaxValue={setMaxValue!}
              disabled={disabled}
              onClick={onClick}
              onMaxButtonBlur={onMaxButtonBlur}
              placeholder={placeholder}
              showFiatValue={showFiatValue}
              $error={!disabled && !!fieldState.error?.message}
              $size={$size}
            />
          ) : (
            <RangeInput
              id={id}
              field={field}
              onClick={onClick}
              disabled={disabled}
              min={min}
              max={max}
              step={step}
            />
          )}

          <ErrorMessage disabled={disabled} error={fieldState.error?.message} />
        </StyledFormControl>
      )
    },
    [
      $size,
      address,
      className,
      decimals,
      disabled,
      id,
      label,
      max,
      min,
      onClick,
      onMaxButtonBlur,
      placeholder,
      setMaxValue,
      showFiatValue,
      step,
      type,
    ]
  )

  return (
    <Controller name={name} control={control} rules={rules} render={renderer} />
  )
}
