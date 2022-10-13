import type {
  Control as ReactHookFormControl,
  RegisterOptions,
} from 'react-hook-form'

import { AvailableTokenAmount, Control } from 'new/Input'

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
      />
    </div>
  )
}
