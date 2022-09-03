import { memo } from 'react'
import { Control, FieldValues } from 'react-hook-form'
import NumberFormat from 'react-number-format'
import clsx from 'clsx'
import styles from '../styles/TokenInput.module.scss'

import type { ExitFormFields } from './type'

import { RangeInput } from '../TokenInput/RangeInput'

type ProportionalExitInputProps = {
  control: Control<ExitFormFields>
  totalFiatValue: string
  value: number
}

function ProportionalExitInput({
  control,
  totalFiatValue,
  value,
}: ProportionalExitInputProps) {
  return (
    <div className={styles.tokenInputField}>
      <div className={clsx(styles.tokenInputGroup, { [styles.error]: false })}>
        <div className={styles.control}>
          <NumberFormat
            className={clsx(styles.input, styles.tokenInput)}
            allowNegative={false}
            decimalScale={2}
            value={totalFiatValue}
            isNumericString
            thousandSeparator={true}
            prefix="$"
            disabled
          />
        </div>

        <RangeInput
          className={styles.percentInput}
          id="percent"
          label="Proportional exit"
          name="percent"
          control={control as any as Control<FieldValues>}
          value={value}
        />
      </div>
    </div>
  )
}

export default memo(ProportionalExitInput)
