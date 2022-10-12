import type {
  Control as ReactHookFormControl,
  RegisterOptions,
} from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import clsx from 'clsx'
import styles from './styles/InputGroup.module.scss'

import { useAccount, usePool } from 'hooks'

import { AvailableTokenAmount, Control } from 'new/Input'
import TokenIcon from 'new/TokenIcon'

type InputGroupProps = {
  control: ReactHookFormControl
  label: string
  maxAmount: string
  name: string
  rules: Partial<RegisterOptions>
  setMaxValue(): void
  disabled?: boolean
}

export function InputGroup({
  control,
  maxAmount,
  name,
  rules,
  setMaxValue,
  disabled,
}: InputGroupProps) {
  const { isConnected } = useAccount()

  return (
    <div>
      <Control
        name={name}
        control={control}
        rules={rules}
        setMaxValue={setMaxValue}
        placeholder="Enter the number of LP Tokens to staking"
        disabled={disabled}
      />
      <AvailableTokenAmount
        label="Your LP Tokens (=Available staking)"
        maxAmount={maxAmount}
        disabled={disabled}
      />
    </div>
  )
}
