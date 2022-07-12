import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
} from 'react-hook-form'
import NumberFormat from 'react-number-format'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import styles from './style.module.scss'

import { Button } from 'components/Button'

const motionVariants = {
  initial: {
    opacity: 0,
    y: '-100%',
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: '-100%',
  },
}

type BaseInputProps = {
  field: ControllerRenderProps<FieldValues>
  fieldState: ControllerFieldState
  precision: number
  setMaxValue(): void
  disabled?: boolean
  maxButtonDisabled?: boolean
  placeholder?: string
}

export function BaseInput({
  field,
  fieldState,
  precision,
  setMaxValue,
  disabled,
  maxButtonDisabled,
  placeholder,
}: BaseInputProps) {
  const nestedClassName = clsx(styles.inputGroup, {
    [styles.error]: !!fieldState.error,
    [styles.disabled]: !!disabled,
  })

  return (
    <>
      <div className={nestedClassName}>
        <NumberFormat
          {...field}
          className={styles.input}
          allowNegative={false}
          decimalScale={precision}
          isNumericString
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
            variants={motionVariants}
          >
            {fieldState.error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </>
  )
}
