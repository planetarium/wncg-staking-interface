import { memo, MouseEvent, useMemo } from 'react'
import type {
  Control as ReactHookFormControl,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form'
import clsx from 'clsx'

import { configService } from 'services/config'
import { getTokenSymbol } from 'utils/token'
import type { JoinFormFields } from './useJoinForm'

import { StyledJoinFormField } from './styled'
import Dropdown from 'new/Dropdown'
import { AvailableTokenAmount, Control } from 'new/Input'
import Warning from './Warning'

type JoinFormInputFieldProps = {
  address: string
  control: ReactHookFormControl<JoinFormFields, 'any'>
  currentEtherType: string
  decimals: number
  maxAmount: string
  maxAmountInFiatValue: number
  name: string
  rules: Partial<RegisterOptions>
  selectEther(e: MouseEvent<HTMLButtonElement>): void
  setMaxValue(e: MouseEvent<HTMLButtonElement>): void
  weight: number
  className?: string
  disabled?: boolean
  warning?: boolean
}

function JoinFormInputField({
  address,
  control,
  currentEtherType,
  maxAmount,
  maxAmountInFiatValue,
  name,
  rules,
  setMaxValue,
  selectEther,
  decimals,
  weight,
  className,
  disabled = false,
  warning = false,
}: JoinFormInputFieldProps) {
  const symbol = getTokenSymbol(address)

  const showWarning =
    name === 'etherAmount' &&
    currentEtherType === configService.nativeAssetAddress &&
    warning

  const list = useMemo(
    () => (name === 'etherAmount' ? configService.etherAddresses : undefined),
    [name]
  )

  return (
    <StyledJoinFormField className={clsx('joinFormInputField', className)}>
      <div className="inputLabel">
        {list ? (
          <Dropdown
            className="label"
            id={`poolTokenInput:${address}`}
            list={list}
            onChange={selectEther}
            value={currentEtherType}
            formatter={getTokenSymbol}
          />
        ) : (
          <h5 className="label" aria-label={`${symbol} input`}>
            {symbol}
          </h5>
        )}
        <span className="weight">{weight}%</span>
      </div>

      <Control
        id={`joinFormInputField:${address}`}
        control={control as unknown as ReactHookFormControl<FieldValues, 'any'>}
        name={name}
        rules={rules}
        decimals={decimals}
        setMaxValue={setMaxValue}
        disabled={disabled}
        placeholder="0.00"
      />
      <AvailableTokenAmount
        label="Available Join pool"
        maxAmount={maxAmount}
        fiatValue={maxAmountInFiatValue}
      />

      <Warning show={showWarning} />
    </StyledJoinFormField>
  )
}

export default memo(JoinFormInputField)
