import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
  FieldValues,
  Control as ReactHookFormControl,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

import { ExitPoolField, LiquidityFieldType } from 'config/constants'
import { QUERY_KEYS } from 'config/constants/queryKeys'
import { useBalances, useFiat, useResponsive, useStaking } from 'hooks'
import { useProportionalExit } from 'hooks/balancer'
import { ExitFormFields } from 'hooks/balancer/useExitForm'
import { bnum } from 'utils/bnum'

import { Control } from 'components/Form'
import NumberFormat from 'components/NumberFormat'
import { formatUnits } from 'viem'
import ButtonGroup from './ButtonGroup'
import PropAmounts from './PropAmounts'
import { StyledExitModalPage1Step2 } from './styled'

const rules = {
  required: true,
  max: 100,
  min: 1,
}

type ExitModalPage1Step2PropExitProps = {
  setValue: UseFormSetValue<ExitFormFields>
  control: ReactHookFormControl<ExitFormFields, 'any'>
  watch: UseFormWatch<ExitFormFields>
  hash?: Hash
}

function ExitModalPage1Step2PropExit({
  setValue,
  control,
  watch,
  hash,
}: ExitModalPage1Step2PropExitProps) {
  const balanceOf = useBalances()
  const toFiat = useFiat()
  const { isMobile } = useResponsive()
  const { lpToken, poolTokenAddresses } = useStaking()

  const { exitPoolPreview } = useProportionalExit()

  const percent = watch(ExitPoolField.LiquidityPercent)

  const useNative = watch('UseNative')

  const userLpBalance = balanceOf(lpToken?.address)
  const bptOutAmount = bnum(userLpBalance)
    .times(percent)
    .div(100)
    .toString() as `${number}`

  const disabled = !!hash

  const { data = [] } = useQuery(
    [QUERY_KEYS.Balancer.Proportional, bptOutAmount],
    () => exitPoolPreview(bptOutAmount),
    {
      staleTime: 10 * 1_000,
      useErrorBoundary: false,
      select(data) {
        return data.amountsOut.map(({ amount, token }) =>
          formatUnits(amount, token.decimals)
        )
      },
    }
  )

  const totalExitFiatValue = useMemo(() => {
    return data
      .reduce((acc, amount, i) => {
        return acc.plus(toFiat(amount, poolTokenAddresses[i]))
      }, bnum(0))
      .toString()
  }, [data, poolTokenAddresses, toFiat])

  return (
    <StyledExitModalPage1Step2 $isPropExit $disabled={disabled}>
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
      <PropAmounts expectedAmountsOut={data} useNative={useNative} />
    </StyledExitModalPage1Step2>
  )
}

export default ExitModalPage1Step2PropExit
