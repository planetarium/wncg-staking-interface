import { memo, MouseEvent, useEffect, useMemo } from 'react'
import { Control, FieldValues, useForm } from 'react-hook-form'
import styles from '../styles/Form.module.scss'

import {
  getEthBalance,
  getWethBalance,
  getWncgBalance,
} from 'app/states/balance'
import Decimal, { sanitizeNumber } from 'utils/num'
import { useAppSelector } from 'hooks'
import { etherTokenList } from '../constants'

import { TokenInput } from '../TokenInput'

type PoolInvestFormProps = {
  currentEthType: EthType
  selectEth(value: EthType): void
}

function PoolInvestForm({ currentEthType, selectEth }: PoolInvestFormProps) {
  const ethBalance = useAppSelector(getEthBalance)
  const wethBalance = useAppSelector(getWethBalance)
  const wncgBalance = useAppSelector(getWncgBalance)

  const ethWalletBalance = currentEthType === 'eth' ? ethBalance : wethBalance

  const { clearErrors, control, formState, setValue, trigger } = useForm<{
    wncgAmount: string
    ethAmount: string
  }>({
    mode: 'onBlur',
  })

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
    } else {
      setValue('ethAmount', ethWalletBalance)
    }
  }

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
      </form>
    </section>
  )
}

export default memo(PoolInvestForm)
