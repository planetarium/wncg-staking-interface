import {
  Control as ReactHookFormControl,
  FieldValues,
  UseFormWatch,
  UseFormSetValue,
} from 'react-hook-form'

import { LiquidityFieldType } from 'config/constants'
import { bnum } from 'utils/bnum'
import { useBalances, useFiat, useResponsive, useStaking } from 'hooks'
import { ExitFormFields } from 'hooks/balancer/useExitForm'

import { StyledExitModalPage1Step2 } from './styled'
import NumberFormat from 'components/NumberFormat'
import { Control } from 'components/Form'
import ButtonGroup from './ButtonGroup'
import PropAmounts from './PropAmounts'
import { useExactInExit } from 'hooks/balancer'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from 'config/constants/queryKeys'

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

  const { queryExactInExit } = useExactInExit()

  const _pcnt = watch(LiquidityFieldType.LiquidityPercent)
  const bptPcnt = bnum(_pcnt).toString()

  const userLpBalance = balanceOf(lpToken?.address)
  const bptOutAmount = bnum(userLpBalance).times(_pcnt).div(100).toString()

  const disabled = !!hash

  const { data = [] } = useQuery(
    [QUERY_KEYS.Balancer.ExactInExitAmounts, bptPcnt],
    () => queryExactInExit(bptPcnt),
    {
      staleTime: 10 * 1_000,
      useErrorBoundary: false,
      select(data) {
        return data.amountsOut
      },
    }
  )

  const totalBptOutFiatValue = useMemo(() => {
    const bptOutAmount = bnum(_pcnt).times(userLpBalance).div(100).toString()
    return toFiat(bptOutAmount, lpToken.address)
  }, [_pcnt, lpToken.address, toFiat, userLpBalance])

  const totalExitFiatValue = useMemo(() => {
    return data
      .reduce((acc, amt, i) => {
        return acc.plus(toFiat(amt, poolTokenAddresses[i]))
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
              <NumberFormat value={_pcnt} type="percent" parenthesis />
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
          <NumberFormat className="percent" value={_pcnt} type="percent" />
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
        name={LiquidityFieldType.LiquidityPercent}
        rules={rules}
        disabled={disabled}
      />

      <ButtonGroup bptOutPcnt={_pcnt} setValue={setValue} disabled={disabled} />
      <PropAmounts expectedAmountsOut={data} />
    </StyledExitModalPage1Step2>
  )
}

export default ExitModalPage1Step2PropExit
