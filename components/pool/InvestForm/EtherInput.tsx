import { memo, MouseEvent, useEffect, useMemo } from 'react'
import type {
  Control,
  FieldValues,
  UseFormClearErrors,
  UseFormTrigger,
} from 'react-hook-form'

import { getUserBalances } from 'app/states/balance'
import Decimal, { sanitizeNumber } from 'utils/num'
import { useAppSelector } from 'hooks'
import { etherTokenList } from '../constants'
import type { InvestFormFields } from './type'

import { TokenInput } from '../TokenInput'

type EtherInputProps = {
  clearErrors: UseFormClearErrors<InvestFormFields>
  control: Control<InvestFormFields>
  isNativeAsset: boolean
  showPropButton: boolean
  selectEth(value: EthType): void
  setMaxValue(e: MouseEvent<HTMLButtonElement>): void
  setPropAmount(e: MouseEvent<HTMLButtonElement>): void
  trigger: UseFormTrigger<InvestFormFields>
  value: string
  error?: string
}

function EtherInput({
  clearErrors,
  control,
  isNativeAsset,
  selectEth,
  setMaxValue,
  setPropAmount,
  showPropButton,
  trigger,
  value,
  error,
}: EtherInputProps) {
  const userBalances = useAppSelector(getUserBalances)

  const ethNetBalance = isNativeAsset ? userBalances.eth : userBalances.weth
  const ethBalanceAvailable = isNativeAsset
    ? Math.max(new Decimal(ethNetBalance).minus(0.05).toNumber(), 0).toString()
    : ethNetBalance

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
      !new Decimal(value).isZero() &&
      new Decimal(value).eq(ethBalanceAvailable),
    [ethBalanceAvailable, value]
  )

  const tokenName = isNativeAsset ? 'eth' : 'weth'

  const showWarning = useMemo(() => {
    if (!isNativeAsset) return false
    if (error || new Decimal(value).isZero()) return false
    if (new Decimal(ethBalanceAvailable).minus(value).lte(0.05)) {
      return true
    }
    return false
  }, [error, ethBalanceAvailable, value, isNativeAsset])

  useEffect(() => {
    trigger('ethAmount')
  }, [isNativeAsset, trigger, value])

  return (
    <TokenInput
      id="ethAmount"
      name="ethAmount"
      control={control as any as Control<FieldValues, 'any'>}
      rules={rules}
      error={error}
      balance={ethNetBalance}
      maximized={maximized}
      token={tokenName}
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

export default memo(EtherInput)
