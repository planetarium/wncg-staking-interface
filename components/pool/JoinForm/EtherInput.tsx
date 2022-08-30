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
  selectEther(value: string): void
  setMaxValue(e: MouseEvent<HTMLButtonElement>): void
  setPropAmount(e: MouseEvent<HTMLButtonElement>): void
  showPropButton: boolean
  trigger: UseFormTrigger<JoinFormFields>
  value: string
  error?: string
}

function EtherInput({
  clearErrors,
  control,
  currentEther,
  isNativeAsset,
  selectEther,
  setMaxValue,
  setPropAmount,
  showPropButton,
  trigger,
  value,
  error,
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
          return bnum(v).lte(ethBalance) || 'Exceeds wallet balance'
        },
      },
      onChange() {
        clearErrors('ethAmount')
      },
    }),
    [clearErrors, ethBalance]
  )

  const maximized = useMemo(
    () => !bnum(value).isZero() && bnum(value).eq(ethBalanceAvailable),
    [ethBalanceAvailable, value]
  )

  const showWarning = useMemo(() => {
    if (!isNativeAsset) return false
    if (error || bnum(value).isZero()) return false
    if (bnum(ethBalanceAvailable).minus(value).lte(0.05)) {
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
      address={currentEther}
      balance={ethBalance}
      error={error}
      maximized={maximized}
      selectToken={selectEther}
      tokenList={etherAddresses}
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
