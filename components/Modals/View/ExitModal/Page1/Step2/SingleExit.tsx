import { memo, MouseEvent, useMemo } from 'react'
import {
  Control as ReactHookFormControl,
  FieldValues,
  UseFormClearErrors,
  UseFormWatch,
} from 'react-hook-form'

import config from 'config'
import { LiquidityFieldType } from 'config/constants'
import { bnum } from 'utils/bnum'
import { useResponsive, useStaking } from 'hooks'
import { ExitFormFields } from '../../../../../../hooks/useExitForm'

import { StyledExitModalPage1Step2 } from './styled'
import { AvailableBalance, Control } from 'components/Form'

type ExitModalPage1Step2SingleExitProps = {
  clearErrors: UseFormClearErrors<ExitFormFields>
  control: ReactHookFormControl<ExitFormFields, 'any'>
  setMaxValue(e: MouseEvent<HTMLButtonElement>): void
  isNativeCurrency: boolean
  singleExitMaxAmounts: string[]
  singleExitTokenOutIndex?: number
  watch: UseFormWatch<ExitFormFields>
  hash?: Hash
}

function ExitModalPage1Step2SingleExit({
  clearErrors,
  control,
  setMaxValue,
  isNativeCurrency,
  singleExitMaxAmounts,
  singleExitTokenOutIndex = 0,
  watch,
  hash,
}: ExitModalPage1Step2SingleExitProps) {
  const { poolTokens, poolTokenBalances, tokenMap } = useStaking()
  const { isHandheld } = useResponsive()

  const exitType = watch('exitType')

  const singleExitMaxAmount = singleExitMaxAmounts[singleExitTokenOutIndex] ?? 0

  const singleExitRules = useMemo(
    () => ({
      required: 'Please enter valid amount',
      validate: {
        overflow(v: string) {
          return (
            bnum(v).lte(poolTokenBalances[singleExitTokenOutIndex]) ||
            'Exceeds pool balance for this token'
          )
        },
        maxAmount(v: string) {
          return bnum(v).lte(singleExitMaxAmount) || 'Exceeds wallet balance'
        },
      },
      onChange() {
        clearErrors(LiquidityFieldType.ExitAmount)
      },
    }),
    [
      clearErrors,
      poolTokenBalances,
      singleExitMaxAmount,
      singleExitTokenOutIndex,
    ]
  )

  const singleExitToken =
    exitType === config.nativeCurrency.address
      ? tokenMap[config.nativeCurrency.address]
      : poolTokens[singleExitTokenOutIndex]

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
        rules={singleExitRules}
        decimals={singleExitToken.decimals ?? 18}
        setMaxValue={setMaxValue}
        placeholder="0.0"
        $size={isHandheld ? 'sm' : 'lg'}
        disabled={disabled}
      />
      <AvailableBalance
        label="Available exit"
        maxAmount={singleExitMaxAmount}
        symbol={singleExitToken.symbol}
        $size={isHandheld ? 'sm' : 'lg'}
      />
    </StyledExitModalPage1Step2>
  )
}

export default memo(ExitModalPage1Step2SingleExit)
