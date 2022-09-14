import type { Control, RegisterOptions } from 'react-hook-form'
import NumberFormat from 'react-number-format'
import { useRecoilValue } from 'recoil'
import clsx from 'clsx'
import styles from './styles/InputGroup.module.scss'

import { connectedState } from 'app/states/connection'
import { bnum } from 'utils/num'
import { usePool } from 'hooks'

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
  const { poolTokenSymbols } = usePool()

  const isConnected = useRecoilValue(connectedState)
  const isMaxAmountZero = bnum(maxAmount).isZero()

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

      <div
        className={clsx(styles.balanceGroup, { [styles.disabled]: disabled })}
      >
        {poolTokenSymbols.map((symbol) => (
          <TokenIcon
            key={`inputGroup.${symbol}`}
            className={styles.token}
            symbol={symbol}
          />
        ))}
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
