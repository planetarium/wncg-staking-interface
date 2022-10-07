import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
} from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import styles from './style.module.scss'

import { errorMessageVariants } from './constants'

import { Button } from 'components/Button'

type BaseInputProps = {
  field: ControllerRenderProps<FieldValues>
  fieldState: ControllerFieldState
  precision: number
  setMaxValue(): void
  disabled?: boolean
  id?: string
  maxButtonDisabled?: boolean
  placeholder?: string
}

export function BaseInput({
  field,
  fieldState,
  precision,
  setMaxValue,
  disabled,
  id,
  maxButtonDisabled,
  placeholder,
}: BaseInputProps) {
  const nestedClassName = clsx(styles.inputGroup, {
    [styles.error]: !!fieldState.error,
    [styles.disabled]: !!disabled,
  })

  const { ref, ...fieldProps } = field

  return (
    <>
      <div className={nestedClassName}>
        <NumericFormat
          {...fieldProps}
          id={id}
          className={styles.input}
          allowNegative={false}
          decimalScale={precision}
          valueIsNumericString
          thousandSeparator={true}
          disabled={disabled}
          placeholder={placeholder}
        />
        <Button
          className={styles.maxButton}
          variant="secondary"
          onClick={setMaxValue}
          disabled={maxButtonDisabled}
        >
          Max
        </Button>
      </div>

      <AnimatePresence>
        {fieldState.error && (
          <motion.p
            className={styles.errorMessage}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={errorMessageVariants}
          >
            {fieldState.error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </>
  )
}
