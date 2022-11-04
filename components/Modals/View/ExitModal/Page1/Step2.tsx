import { memo, MouseEvent, useMemo } from 'react'
import {
  Control as ReactHookFormControl,
  FieldValues,
  UseFormClearErrors,
} from 'react-hook-form'

import { bnum } from 'utils/num'
import { getTokenInfo, getTokenSymbol } from 'utils/token'
import { usePool } from 'hooks'
import { ExitFormFields } from '../useExitForm'

import { StyledExitModalPage1Step2 } from './styled'
import { AvailableTokenAmount, Control } from 'components/Input'
import PropAmounts from './PropAmounts'

const propExitRules = {
  required: true,
  max: 100,
  min: 1,
}

type ExitModalPage1Step2Props = {
  bptOutPcnt: number
  clearErrors: UseFormClearErrors<ExitFormFields>
  control: ReactHookFormControl<ExitFormFields, 'any'>
  disabled: boolean
  exitType: string
  setMaxValue(e: MouseEvent<HTMLButtonElement>): void
  singleExitMaxAmounts: string[]
  singleExitTokenOutIndex?: number
}

function ExitModalPage1Step2({
  bptOutPcnt,
  clearErrors,
  control,
  disabled,
  exitType,
  setMaxValue,
  singleExitMaxAmounts,
  singleExitTokenOutIndex = 0,
}: ExitModalPage1Step2Props) {
  const { poolTokenBalances } = usePool()

  const isSingleExit = useMemo(() => exitType !== 'all', [exitType])

  const title = useMemo(
    () =>
      isSingleExit
        ? 'How much do you want to exit?'
        : 'Proportional withdrawal',
    [isSingleExit]
  )

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
        clearErrors('tokenOutAmount')
      },
    }),
    [
      clearErrors,
      poolTokenBalances,
      singleExitMaxAmount,
      singleExitTokenOutIndex,
    ]
  )

  return (
    <StyledExitModalPage1Step2 $disabled={disabled}>
      <header className="header">
        <span className="count">2</span>
        <h4 className="title">{title}</h4>
        {!isSingleExit && <strong className="pcnt">{bptOutPcnt}%</strong>}
      </header>

      {isSingleExit && (
        <>
          <Control
            id="exitFormInputField:singleExit"
            className="singleExit"
            control={
              control as unknown as ReactHookFormControl<FieldValues, 'any'>
            }
            name="tokenOutAmount"
            rules={singleExitRules}
            decimals={getTokenInfo(exitType)?.decimals ?? 18}
            setMaxValue={setMaxValue}
            placeholder="0.00"
          />
          <AvailableTokenAmount
            label={`Available exit ${getTokenSymbol(exitType)}`}
            maxAmount={singleExitMaxAmount}
          />
        </>
      )}

      {!isSingleExit && (
        <>
          <Control
            id="exitFormInputField:propExit"
            className="propExit"
            type="range"
            control={
              control as unknown as ReactHookFormControl<FieldValues, 'any'>
            }
            name="bptOutPcnt"
            rules={propExitRules}
            decimals={getTokenInfo(exitType)?.decimals ?? 18}
            setMaxValue={setMaxValue}
            placeholder="0.00"
          />
          <PropAmounts bptOutPcnt={bptOutPcnt} />
        </>
      )}
    </StyledExitModalPage1Step2>
  )
}

export default memo(ExitModalPage1Step2)
