import type { Control, RegisterOptions } from 'react-hook-form'
import NumberFormat from 'react-number-format'
import Image from 'next/image'
import clsx from 'clsx'
import styles from './styles/InputGroup.module.scss'

import { getIsConnected } from 'app/states/connection'
import Decimal, { sanitizeNumber } from 'utils/num'
import { useAppSelector } from 'hooks'

import { Icon } from 'components/Icon'
import { Input } from 'components/Input'

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
        <span className={clsx(styles.token, styles.ether)}>
          <Icon id="ethereumSimple" />
        </span>
        <span className={clsx(styles.token, styles.wncg)}>
          <Image
            src="/img-wncg.png"
            layout="fill"
            objectFit="contain"
            priority
            alt=""
          />
        </span>
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
