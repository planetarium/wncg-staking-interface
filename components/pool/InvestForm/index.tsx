import { memo, MouseEvent, useEffect, useMemo } from 'react'
import { Control, FieldValues, useForm } from 'react-hook-form'
import styles from '../styles/Form.module.scss'

import {
  getEthBalance,
  getWethBalance,
  getWncgBalance,
} from 'app/states/balance'
import { ModalCategory } from 'app/states/modal'
import Decimal, { sanitizeNumber } from 'utils/num'
import { useAppSelector, useInvestMath, useModal, useUsd } from 'hooks'
import { etherTokenList } from '../constants'

import { Button } from 'components/Button'
import { TokenInput } from '../TokenInput'
import { InvestFormSummary } from './Summary'

type PoolInvestFormProps = {
  currentEthType: EthType
  selectEth(value: EthType): void
}

function PoolInvestForm({ currentEthType, selectEth }: PoolInvestFormProps) {
  const { getPriceImpact, getPropAmounts } = useInvestMath()
  const { addModal } = useModal()
  const { calculateUsdValue } = useUsd()

  const ethBalance = useAppSelector(getEthBalance)
  const wethBalance = useAppSelector(getWethBalance)
  const wncgBalance = useAppSelector(getWncgBalance)

  const isEth = currentEthType === 'eth'
  const ethNetBalance = isEth ? ethBalance : wethBalance
  const ethBalanceAvailable = isEth
    ? Math.max(new Decimal(ethNetBalance).minus(0.05).toNumber(), 0).toString()
    : ethNetBalance

  const { clearErrors, control, formState, setValue, trigger, watch } =
    useForm<{
      wncgAmount: string
      ethAmount: string
    }>({
      mode: 'onChange',
    })

  const ethValue = sanitizeNumber(watch('ethAmount'))
  const wncgValue = sanitizeNumber(watch('wncgAmount'))
  const amounts = [wncgValue, ethValue]

  const ethRules = useMemo(
    () => ({
      validate: {
        maxAmount(v: string) {
          return (
            new Decimal(sanitizeNumber(v)).lte(ethNetBalance) ||
            'Exceeds wallet balance'
          )
        },
      },
      onChange() {
        clearErrors('ethAmount')
      },
    }),
    [clearErrors, ethNetBalance]
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
    setValue('ethAmount', ethBalanceAvailable)
  }

  function setPropAmount(e: MouseEvent<HTMLButtonElement>) {
    const inputName = e.currentTarget.value as 'wncgAmount' | 'ethAmount'
    const currentTokenIndex = inputName === 'wncgAmount' ? 0 : 1

    const propAmounts = getPropAmounts(amounts, currentTokenIndex)
    setValue(inputName, propAmounts[currentTokenIndex])

    trigger(inputName)
  }

  function investMax() {
    setValue('ethAmount', ethBalanceAvailable)
    setValue('wncgAmount', wncgBalance)
    clearErrors()
  }

  function openInvestPreview(e: MouseEvent) {
    e.stopPropagation()

    addModal({
      category: ModalCategory.InvestPreview,
      props: {
        amounts,
        currentEthType,
        priceImpact,
        totalUsdValue,
      },
    })
  }

  const priceImpact = useMemo(() => {
    return getPriceImpact([wncgValue, ethValue])
  }, [ethValue, getPriceImpact, wncgValue])

  const totalUsdValue = useMemo(() => {
    return new Decimal(calculateUsdValue('wncg', wncgValue))
      .add(calculateUsdValue('weth', ethValue))
      .toString()
  }, [calculateUsdValue, ethValue, wncgValue])

  const isWncgMaximized = useMemo(
    () => new Decimal(wncgValue).eq(wncgBalance),
    [wncgBalance, wncgValue]
  )

  const isEthMaximized = useMemo(
    () =>
      !new Decimal(ethValue).isZero() &&
      new Decimal(ethValue).eq(ethBalanceAvailable),
    [ethBalanceAvailable, ethValue]
  )

  const isMaximized = useMemo(
    () => isWncgMaximized && isEthMaximized,
    [isEthMaximized, isWncgMaximized]
  )

  const isAllZero = useMemo(
    () => new Decimal(wncgValue).isZero() && new Decimal(ethValue).isZero(),
    [ethValue, wncgValue]
  )

  const showPropButton = useMemo(() => {
    const hasError = !!Object.keys(formState.errors).length
    const wncg = new Decimal(wncgValue)
    const eth = new Decimal(ethValue)

    return {
      wncgAmount: !hasError && wncg.isZero() && !eth.isZero(),
      ethAmount: !hasError && eth.isZero() && !wncg.isZero(),
    }
  }, [ethValue, formState, wncgValue])

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
          maximized={isWncgMaximized}
          token="wncg"
          setMaxValue={setMaxValue}
          setPropAmount={setPropAmount}
          propButton={showPropButton.wncgAmount}
        />
        <TokenInput
          id="ethAmount"
          name="ethAmount"
          control={control as any as Control<FieldValues, 'any'>}
          rules={ethRules}
          error={formState.errors?.ethAmount?.message}
          balance={ethNetBalance}
          maximized={isEthMaximized}
          token={currentEthType}
          selectToken={selectEth}
          tokenList={etherTokenList}
          setMaxValue={setMaxValue}
          setPropAmount={setPropAmount}
          propButton={showPropButton.ethAmount}
        />
        <InvestFormSummary
          investMax={investMax}
          maximized={isMaximized}
          priceImpact={priceImpact}
          totalUsdValue={totalUsdValue}
        />
        <Button
          size="large"
          type="button"
          onClick={openInvestPreview}
          fullWidth
          disabled={isAllZero}
        >
          Preview
        </Button>
      </form>
    </section>
  )
}

export default memo(PoolInvestForm)
