import { Control as ReactHookFormControl, FieldValues } from 'react-hook-form'
import { useAtomValue } from 'jotai'

import { exitTxAtom } from 'states/tx'
import { RemoveLiquidityField } from 'config/constants'
import { useBalances, useStaking } from 'hooks'
import { UseRemoveLiquidityFormReturns } from 'hooks/pancakeswap/useRemoveLiquidityForm'

import { StyledRemoveLiquidityModalPage1Form } from './styled'
import { Control } from 'components/Form'
import NumberFormat from 'components/NumberFormat'
import ButtonGroup from './ButtonGroup'
import Summary from './Summary'

const rules = {
  required: true,
}

type RemoveLiquidityModalPage1FormProps = UseRemoveLiquidityFormReturns

export default function RemoveLiquidityModalPage1Form(
  props: RemoveLiquidityModalPage1FormProps
) {
  const {
    assets,
    amountsOut,
    amountsOutFiatValue,
    lpAmountOut,
    isNative,
    pcntOut,
    control,
    setValue,
  } = props

  const balanceOf = useBalances()
  const { lpToken } = useStaking()

  const lpBalance = balanceOf(lpToken?.address)
  const tx = useAtomValue(exitTxAtom)

  const disabled = !!tx?.hash

  return (
    <StyledRemoveLiquidityModalPage1Form>
      <header className="formHeader">
        <div className="formLabel">
          <span className="count">1</span>
          <label className="label" htmlFor="exitPcnt">
            Amount to withdraw
          </label>
        </div>

        <output className="formOutput" htmlFor="exitPcnt">
          <div className="amount">
            <NumberFormat
              className="value"
              value={lpAmountOut}
              symbol={lpToken?.name}
              decimals={8}
            />
            <NumberFormat value={pcntOut} type="percent" parenthesis />
          </div>

          <NumberFormat
            className="totalBalance"
            value={lpBalance}
            prefix="My balance : "
            symbol={lpToken?.name}
          />
        </output>
      </header>

      <Control<'range'>
        id="exitPcnt"
        name={RemoveLiquidityField.Percent}
        rules={rules}
        control={control as unknown as ReactHookFormControl<FieldValues, 'any'>}
        type="range"
        min={0}
        max={100}
        step={0.1}
        disabled={disabled}
      />
      <ButtonGroup exitPcnt={pcntOut} setValue={setValue} disabled={disabled} />

      <Summary
        assets={assets}
        amountsOut={amountsOut}
        amountsOutFiatValue={amountsOutFiatValue}
        isNative={isNative}
        setValue={setValue}
      />
    </StyledRemoveLiquidityModalPage1Form>
  )
}
