import type { Control, RegisterOptions } from 'react-hook-form'
import NumberFormat from 'react-number-format'
import styles from './styles/InputGroup.module.scss'

import { getIsConnected } from 'app/states/connection'
import Decimal, { sanitizeNumber } from 'utils/num'
import { useAppSelector } from 'hooks'

import { Input } from 'components/Input'
import { TokenIcon } from 'components/TokenIcon'

type InputGroupProps = {
  control: Control
  label: string
  maxAmount: string
  name: string
  rules: Partial<RegisterOptions>
  setMaxValue(): void
  disabled?: boolean
}

export function InputGroup({
  control,
  label,
  maxAmount,
  name,
  rules,
  setMaxValue,
  disabled,
}: InputGroupProps) {
  const isConnected = useAppSelector(getIsConnected)
  const isMaxAmountZero = new Decimal(sanitizeNumber(maxAmount)).isZero()

  return (
    <div className={styles.inputGroup}>
      <Input
        name={name}
        control={control}
        rules={rules}
        setMaxValue={setMaxValue}
        placeholder="0.0"
        disabled={disabled}
        maxButtonDisabled={isMaxAmountZero}
      />

      <div className={styles.balanceGroup}>
        <TokenIcon className={styles.token} symbol="weth" />
        <TokenIcon className={styles.token} symbol="wncg" />
        <strong>{label}</strong>
        {isConnected ? (
          <NumberFormat
            className={styles.balance}
            decimalScale={8}
            displayType="text"
            isNumericString
            thousandSeparator={true}
            value={maxAmount}
          />
        ) : (
          <span className={styles.balance}>-</span>
        )}
      </div>
    </div>
  )
}
