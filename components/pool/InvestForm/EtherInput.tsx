import { MouseEvent, useMemo } from 'react'
import type { Control, FieldValues, UseFormClearErrors } from 'react-hook-form'

import Decimal, { sanitizeNumber } from 'utils/num'
import { etherTokenList } from '../constants'
import type { InvestFormFields } from './type'

import { TokenInput } from '../TokenInput'

type EtherInputProps = {
  clearErrors: UseFormClearErrors<InvestFormFields>
  control: Control<InvestFormFields>
  currentEthType: EthType
  ethValue: string
  ethNetBalance: string
  ethBalanceAvailable: string
  selectEth(value: EthType): void
  setMaxValue(e: MouseEvent<HTMLButtonElement>): void
  setPropAmount(e: MouseEvent<HTMLButtonElement>): void
  showPropButton: boolean
  error?: string
}

export function EtherInput({
  clearErrors,
  control,
  currentEthType,
  ethValue,
  ethNetBalance,
  ethBalanceAvailable,
  selectEth,
  setMaxValue,
  setPropAmount,
  showPropButton,
  error,
}: EtherInputProps) {
  const rules = useMemo(
    () => ({
      validate: {
        maxAmount(v: string) {
          return (
            new Decimal(sanitizeNumber(v)).lte(ethNetBalance) ||
            'Exceeds wallet balance'
          )
        },
      },
      onChange() {
        clearErrors('ethAmount')
      },
    }),
    [clearErrors, ethNetBalance]
  )

  const maximized = useMemo(
    () =>
      !new Decimal(ethValue).isZero() &&
      new Decimal(ethValue).eq(ethBalanceAvailable),
    [ethBalanceAvailable, ethValue]
  )

  const showWarning = useMemo(() => {
    if (error || new Decimal(ethValue).isZero()) return false
    if (new Decimal(ethBalanceAvailable).minus(ethValue).lte(0.05)) {
      return true
    }
    return false
  }, [error, ethBalanceAvailable, ethValue])

  return (
    <TokenInput
      id="ethAmount"
      name="ethAmount"
      control={control as any as Control<FieldValues, 'any'>}
      rules={rules}
      error={error}
      balance={ethNetBalance}
      maximized={maximized}
      token={currentEthType}
      selectToken={selectEth}
      tokenList={etherTokenList}
      setMaxValue={setMaxValue}
      setPropAmount={setPropAmount}
      propButton={showPropButton}
      warning={
        showWarning
          ? 'To ensure a smooth transaction, at least 0.05 ETH must be left in your wallet to pay for gas fees.'
          : undefined
      }
    />
  )
}
