import { memo, MouseEvent, useEffect, useMemo } from 'react'
import type {
  Control,
  FieldValues,
  UseFormClearErrors,
  UseFormTrigger,
} from 'react-hook-form'

import { configService } from 'services/config'
import { uniqAddress } from 'utils/address'
import { bnum } from 'utils/num'
import { useBalances, usePool } from 'hooks'
import type { JoinFormFields } from './type'

import { TokenInput } from '../TokenInput'

type EtherInputProps = {
  clearErrors: UseFormClearErrors<JoinFormFields>
  control: Control<JoinFormFields>
  currentEther: string
  isNativeAsset: boolean
  maximized: boolean
  selectEther(value: string): void
  setMaxValue(e: MouseEvent<HTMLButtonElement>): void
  setPropAmount(e: MouseEvent<HTMLButtonElement>): void
  showPropButton: boolean
  trigger: UseFormTrigger<JoinFormFields>
  value: string
  error?: string
  fiatValue?: number
}

function EtherInput({
  clearErrors,
  control,
  currentEther,
  isNativeAsset,
  maximized,
  selectEther,
  setMaxValue,
  setPropAmount,
  showPropButton,
  trigger,
  value,
  error,
  fiatValue,
}: EtherInputProps) {
  const { balanceFor } = useBalances()
  const { nativeAssetIndex, poolTokenAddresses } = usePool()

  const etherAddresses = useMemo(
    () =>
      uniqAddress([
        configService.nativeAssetAddress,
        poolTokenAddresses[nativeAssetIndex],
      ]),
    [nativeAssetIndex, poolTokenAddresses]
  )

  const ethBalance = balanceFor(currentEther)
  const ethBalanceAvailable = isNativeAsset
    ? Math.max(bnum(ethBalance).minus(0.05).toNumber(), 0).toString()
    : ethBalance

  const rules = useMemo(
    () => ({
      validate: {
        maxAmount(v: string) {
          const bValue = bnum(v)
          if (bValue.isNaN()) return true
          return bValue.lte(ethBalance) || 'Exceeds wallet balance'
        },
      },
      onChange() {
        clearErrors('ethAmount')
      },
    }),
    [clearErrors, ethBalance]
  )

  const showWarning = useMemo(() => {
    if (!isNativeAsset) return false
    if (error || value === '') return false
    if (bnum(ethBalanceAvailable).minus(value).lte(0.05)) {
      return true
    }
    return false
  }, [error, ethBalanceAvailable, value, isNativeAsset])

  useEffect(() => {
    trigger('ethAmount')
  }, [ethBalance, isNativeAsset, trigger, value])

  return (
    <TokenInput
      id="ethAmount"
      name="ethAmount"
      control={control as any as Control<FieldValues, 'any'>}
      rules={rules}
      action="join"
      address={currentEther}
      error={error}
      fiatValue={fiatValue}
      max={ethBalance}
      maximized={maximized}
      selectToken={selectEther}
      tokenList={etherAddresses}
      setMaxValue={setMaxValue}
      setPropAmount={setPropAmount}
      propButton={showPropButton}
      warning={
        showWarning
          ? 'To ensure a smooth transaction, at least 0.05 ETH is required.'
          : undefined
      }
    />
  )
}

export default memo(EtherInput)
