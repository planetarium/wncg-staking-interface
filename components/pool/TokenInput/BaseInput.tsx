import { Control, Controller, RegisterOptions } from 'react-hook-form'
import NumberFormat from 'react-number-format'
import clsx from 'clsx'
import styles from '../styles/TokenInput.module.scss'

type TokenBaseInputProps = {
  control: Control
  name: string
  id: string
  precision: number
  className?: string
  disabled?: boolean
  rules?: Partial<RegisterOptions>
}

export function TokenBaseInput({
  control,
  name,
  id,
  precision,
  className,
  disabled,
  rules = {},
}: TokenBaseInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <NumberFormat
            {...field}
            id={id}
            className={clsx(styles.input, className)}
            allowNegative={false}
            decimalScale={precision}
            isNumericString
            thousandSeparator={true}
            disabled={disabled}
            placeholder="0.0"
          />
        )
      }}
      rules={rules}
    />
  )
}
