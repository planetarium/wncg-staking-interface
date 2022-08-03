import { memo, MouseEvent, useEffect, useMemo, useState } from 'react'
import { Control, FieldValues, useForm } from 'react-hook-form'
import styles from '../styles/Form.module.scss'

import {
  getEthBalance,
  getWethBalance,
  getWncgBalance,
} from 'app/states/balance'
import Decimal, { sanitizeNumber } from 'utils/num'
import { useAppSelector, useUsd } from 'hooks'
import { useInvestMath } from './useInvestMath'
import { etherTokenList } from '../constants'

import { Button } from 'components/Button'
import { TokenInput } from '../TokenInput'
import { InvestFormSummary } from './Summary'

type PoolInvestFormProps = {
  currentEthType: EthType
  selectEth(value: EthType): void
}

function PoolInvestForm({ currentEthType, selectEth }: PoolInvestFormProps) {
  const { getPriceImpact } = useInvestMath()
  const { calculateUsdValue } = useUsd()

  const ethBalance = useAppSelector(getEthBalance)
  const wethBalance = useAppSelector(getWethBalance)
  const wncgBalance = useAppSelector(getWncgBalance)

  const isEth = currentEthType === 'eth'
  const ethWalletBalance = isEth ? ethBalance : wethBalance

  const { clearErrors, control, formState, setValue, trigger, watch } =
    useForm<{
      wncgAmount: string
      ethAmount: string
    }>({
      mode: 'onBlur',
    })

  const ethValue = sanitizeNumber(watch('ethAmount'))
  const wncgValue = sanitizeNumber(watch('wncgAmount'))

  const ethRules = useMemo(
    () => ({
      validate: {
        maxAmount(v: string) {
          return (
            new Decimal(sanitizeNumber(v)).lte(ethWalletBalance) ||
            'Exceeds wallet balance'
          )
        },
      },
      onChange() {
        clearErrors('ethAmount')
      },
    }),
    [clearErrors, ethWalletBalance]
  )
  const wncgRules = useMemo(
    () => ({
      validate: {
        maxAmount(v: string) {
          return (
            new Decimal(sanitizeNumber(v)).lte(wncgBalance) ||
            'Exceeds wallet balance'
          )
        },
      },
      onChange() {
        clearErrors('wncgAmount')
      },
    }),
    [clearErrors, wncgBalance]
  )

  function setMaxValue(e: MouseEvent<HTMLButtonElement>) {
    const inputName = e.currentTarget.value as 'wncgAmount' | 'ethAmount'
    clearErrors(inputName)

    if (inputName === 'wncgAmount') {
      setValue('wncgAmount', wncgBalance)
      return
    }

    const adjustedEthBalance = isEth
      ? new Decimal(ethWalletBalance).minus(0.05).toString()
      : ethWalletBalance

    setValue('ethAmount', adjustedEthBalance)
  }

  const priceImpact = useMemo(() => {
    return getPriceImpact([wncgValue, ethValue])
  }, [ethValue, getPriceImpact, wncgValue])

  const totalUsdValue = useMemo(() => {
    return new Decimal(calculateUsdValue('wncg', wncgValue))
      .add(calculateUsdValue('weth', ethValue))
      .toString()
  }, [calculateUsdValue, ethValue, wncgValue])

  useEffect(() => {
    trigger('ethAmount')
  }, [currentEthType, trigger])

  return (
    <section className={styles.formSection}>
      <header className={styles.header}>
        <h3 className={styles.title}>Invest in pool</h3>
      </header>

      <form>
        <TokenInput
          id="wncgAmount"
          name="wncgAmount"
          control={control as any as Control<FieldValues, 'any'>}
          rules={wncgRules}
          error={formState.errors?.wncgAmount?.message}
          balance={wncgBalance}
          token="wncg"
          setMaxValue={setMaxValue}
        />
        <TokenInput
          id="ethAmount"
          name="ethAmount"
          control={control as any as Control<FieldValues, 'any'>}
          rules={ethRules}
          error={formState.errors?.ethAmount?.message}
          balance={ethWalletBalance}
          token={currentEthType}
          selectToken={selectEth}
          tokenList={etherTokenList}
          setMaxValue={setMaxValue}
        />
        <InvestFormSummary
          priceImpact={priceImpact}
          totalUsdValue={totalUsdValue}
        />
        <Button size="large" type="submit" fullWidth>
          Proceed
        </Button>
      </form>
    </section>
  )
}

export default memo(PoolInvestForm)
