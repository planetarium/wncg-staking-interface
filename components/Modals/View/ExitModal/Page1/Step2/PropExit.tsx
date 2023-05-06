import { memo } from 'react'
import {
  Control as ReactHookFormControl,
  FieldValues,
  UseFormWatch,
  UseFormSetValue,
} from 'react-hook-form'

import { LiquidityFieldType } from 'config/constants'
import { bnum } from 'utils/bnum'
import { useBalances, useResponsive, useStaking } from 'hooks'
import { ExitFormFields } from 'hooks/useExitForm'

import { StyledExitModalPage1Step2 } from './styled'
import NumberFormat from 'components/NumberFormat'
import { Control } from 'components/Form'
import ButtonGroup from './ButtonGroup'
import PropAmounts from './PropAmounts'

const rules = {
  required: true,
  max: 100,
  min: 1,
}

type ExitModalPage1Step2PropExitProps = {
  assets: Hash[]
  exitAmounts: string[]
  setValue: UseFormSetValue<ExitFormFields>
  control: ReactHookFormControl<ExitFormFields, 'any'>
  watch: UseFormWatch<ExitFormFields>
  hash?: Hash
}

function ExitModalPage1Step2PropExit({
  assets,
  exitAmounts,
  setValue,
  control,
  watch,
  hash,
}: ExitModalPage1Step2PropExitProps) {
  const balanceOf = useBalances()
  const { stakedTokenAddress } = useStaking()
  const { isMobile } = useResponsive()

  const bptOutPcnt = watch(LiquidityFieldType.LiquidityPercent)

  const bptBalance = balanceOf(stakedTokenAddress)
  const bptOutAmount = bnum(bptBalance).times(bptOutPcnt).div(100).toString()

  const disabled = !!hash

  return (
    <StyledExitModalPage1Step2 $isProportional $disabled={disabled}>
      <header className="header">
        <span className="count">2</span>
        <h4 className="title">Proportional withdraw</h4>

        {!isMobile ? (
          <output className="formOutput" htmlFor="exitPcnt">
            <div className="amount">
              <NumberFormat
                className="value"
                value={bptOutAmount}
                symbol="LP"
              />
              <NumberFormat value={bptOutPcnt} type="percent" parenthesis />
            </div>

            <NumberFormat
              className="totalBalance"
              value={bptBalance}
              prefix="My balance : "
              symbol="LP"
            />
          </output>
        ) : (
          <NumberFormat className="percent" value={bptOutPcnt} type="percent" />
        )}
      </header>

      <Control<'range'>
        id="exitFormInputField:propExit"
        className="propExit"
        type="range"
        control={control as unknown as ReactHookFormControl<FieldValues>}
        min={0}
        max={100}
        step={1}
        name={LiquidityFieldType.LiquidityPercent}
        rules={rules}
        disabled={disabled}
      />

      <ButtonGroup
        bptOutPcnt={bptOutPcnt}
        setValue={setValue}
        disabled={disabled}
      />

      <PropAmounts assets={assets} exitAmounts={exitAmounts} />
    </StyledExitModalPage1Step2>
  )
}

export default memo(ExitModalPage1Step2PropExit)
