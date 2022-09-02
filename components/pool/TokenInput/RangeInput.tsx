import { Control, Controller } from 'react-hook-form'
import clsx from 'clsx'
import styles from '../styles/RangeInput.module.scss'

type RangeInputProps = {
  control: Control
  id: string
  name: string
  value: number
  className?: string
  label?: string
  step?: number
}

export function RangeInput({
  control,
  id,
  name,
  value,
  className,
  label,
  step = 1,
}: RangeInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ max: 100, min: 0 }}
      render={({ field }) => {
        return (
          <div className={clsx(styles.rangeInput, className)}>
            {label && <strong className={styles.label}>{label}</strong>}
            <input
              id={id}
              className={styles.input}
              type="range"
              {...field}
              step={step}
              style={{ backgroundSize: `${value}% 100%` }}
            />
            <span className={styles.value}>{value}%</span>
          </div>
        )
      }}
    />
  )
}
