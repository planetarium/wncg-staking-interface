import {
  FieldValues,
  Control as ReactHookFormControl,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

import { ExitPoolField } from 'config/constants'
import { useBalances, useFiat, useResponsive, useStaking } from 'hooks'
import { ExitFormFields } from 'hooks/balancer/useExitForm'

import { Control } from 'components/Form'
import NumberFormat from 'components/NumberFormat'
import ButtonGroup from './ButtonGroup'
import PropAmounts from './PropAmounts'
import { StyledExitModalPage1Step2 } from './styled'

const rules = {
  required: true,
  max: 100,
  min: 1,
}

type ExitModalPage1Step2Props = {
  totalExitFiatValue: `${number}`
  amountIn: `${number}`
  receiveAmounts: `${number}`[]
  setValue: UseFormSetValue<ExitFormFields>
  control: ReactHookFormControl<ExitFormFields, 'any'>
  watch: UseFormWatch<ExitFormFields>
  hash?: Hash
}

function ExitModalPage1Step2({
  totalExitFiatValue,
  amountIn,
  receiveAmounts,
  setValue,
  control,
  watch,
  hash,
}: ExitModalPage1Step2Props) {
  const balanceOf = useBalances()
  const toFiat = useFiat()
  const { isMobile } = useResponsive()
  const { lpToken, poolTokenAddresses } = useStaking()

  const percent = watch(ExitPoolField.LiquidityPercent)

  const useNative = watch('UseNative')

  const userLpBalance = balanceOf(lpToken?.address)

  const disabled = !!hash

  return (
    <StyledExitModalPage1Step2 $isPropExit $disabled={disabled}>
      <header className="header">
        <span className="count">2</span>
        <h4 className="title">Proportional withdraw</h4>

        {!isMobile ? (
          <output className="formOutput" htmlFor="exitPcnt">
            <div className="amount">
              <NumberFormat className="value" value={amountIn} symbol="LP" />
              <NumberFormat value={percent} type="percent" parenthesis />
            </div>

            <NumberFormat
              className="fiatValue"
              value={totalExitFiatValue}
              type="fiat"
            />
            <NumberFormat
              className="totalBalance"
              value={userLpBalance}
              prefix="My total balance : "
              symbol="LP"
              parenthesis
            />
          </output>
        ) : (
          <NumberFormat className="percent" value={percent} type="percent" />
        )}
      </header>

      <Control<'range'>
        id="exitFormInputField:exactInExit"
        className="propExit"
        type="range"
        control={control as unknown as ReactHookFormControl<FieldValues>}
        min={0}
        max={100}
        step={1}
        name={ExitPoolField.LiquidityPercent}
        rules={rules}
        disabled={disabled}
      />

      <ButtonGroup
        bptOutPcnt={percent}
        setValue={setValue}
        disabled={disabled}
      />
      <PropAmounts expectedAmountsOut={receiveAmounts} useNative={useNative} />
    </StyledExitModalPage1Step2>
  )
}

export default ExitModalPage1Step2
