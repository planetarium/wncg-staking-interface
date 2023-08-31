import { useCallback, useMemo } from 'react'
import {
  Control as ReactHookFormControl,
  FieldValues,
  UseFormClearErrors,
  UseFormWatch,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form'
import { isSameAddress } from '@balancer-labs/sdk'

import { NATIVE_CURRENCY_ADDRESS } from 'config/constants/addresses'
import { LiquidityFieldType } from 'config/constants'
import { bnum } from 'utils/bnum'
import { useChain, useFiat, useResponsive, useStaking } from 'hooks'
import { ExitFormFields } from 'hooks/balancer/useExitForm'

import { StyledExitModalPage1Step2 } from './styled'
import { AvailableBalance, Control } from 'components/Form'

type ExitModalPage1Step2SingleExitProps = {
  clearErrors: UseFormClearErrors<ExitFormFields>
  control: ReactHookFormControl<ExitFormFields, 'any'>
  watch: UseFormWatch<ExitFormFields>
  setValue: UseFormSetValue<ExitFormFields>
  trigger: UseFormTrigger<ExitFormFields>
  singleExitMaxAmounts: string[]
  hash?: Hash
}

function ExitModalPage1Step2SingleExit({
  clearErrors,
  control,
  watch,
  setValue,
  trigger,
  singleExitMaxAmounts,
  hash,
}: ExitModalPage1Step2SingleExitProps) {
  const { nativeCurrency } = useChain()
  const toFiat = useFiat()
  const { poolTokens, poolTokenBalances, tokens } = useStaking()
  const { isHandheld } = useResponsive()

  const exitType = watch('exitType')!

  const tokenOutIndex = poolTokens.findIndex((t) => {
    const compare =
      exitType === NATIVE_CURRENCY_ADDRESS
        ? nativeCurrency.wrappedTokenAddress
        : exitType
    return isSameAddress(t.address, compare)
  })

  const maxExitAmount = singleExitMaxAmounts[tokenOutIndex] ?? 0

  const rules = useMemo(
    () => ({
      required: true,
      validate: {
        overflow(v: string) {
          return (
            bnum(v).lte(poolTokenBalances[tokenOutIndex]) ||
            'Exceeds available exit balance'
          )
        },
        maxAmount(v: string) {
          return bnum(v).lte(maxExitAmount) || 'Exceeds available exit balance'
        },
      },
      onChange() {
        clearErrors(LiquidityFieldType.ExitAmount)
      },
    }),
    [clearErrors, poolTokenBalances, maxExitAmount, tokenOutIndex]
  )

  const singleExitToken =
    exitType === NATIVE_CURRENCY_ADDRESS
      ? tokens[NATIVE_CURRENCY_ADDRESS]
      : poolTokens[tokenOutIndex]

  const fiatValue = toFiat(maxExitAmount, singleExitToken?.address)

  const setMaxValue = useCallback(() => {
    const maxExitAmount = singleExitMaxAmounts[tokenOutIndex]
    setValue(LiquidityFieldType.ExitAmount, maxExitAmount)
    trigger()
  }, [singleExitMaxAmounts, setValue, tokenOutIndex, trigger])

  const disabled = !!hash

  return (
    <StyledExitModalPage1Step2 $disabled={disabled}>
      <header className="header">
        <span className="count">2</span>
        <h4 className="title">How much do you want to exit?</h4>
      </header>

      <Control<'number'>
        id="exitFormInputField:singleExit"
        className="singleExit"
        control={control as unknown as ReactHookFormControl<FieldValues>}
        name={LiquidityFieldType.ExitAmount}
        address={singleExitToken?.address}
        maxAmount={maxExitAmount}
        rules={rules}
        decimals={singleExitToken.decimals ?? 18}
        setMaxValue={setMaxValue}
        placeholder="0.0"
        $size={isHandheld ? 'sm' : 'md'}
        disabled={disabled}
        showFiatValue
      />
      <AvailableBalance
        label="Available exit"
        maxAmount={maxExitAmount}
        symbol={singleExitToken.symbol}
        fiatValue={fiatValue}
        $size={isHandheld ? 'sm' : 'lg'}
      />
    </StyledExitModalPage1Step2>
  )
}

export default ExitModalPage1Step2SingleExit
