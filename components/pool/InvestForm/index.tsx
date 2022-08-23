import { memo, MouseEvent, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import styles from '../styles/Form.module.scss'

import { getUserBalances } from 'app/states/balance'
import { ModalCategory } from 'app/states/modal'
import Decimal, { sanitizeNumber } from 'utils/num'
import { useAppSelector, useInvestMath, useModal, useUsd } from 'hooks'
import type { InvestFormFields } from './type'

import { Button } from 'components/Button'
import { EtherInput } from './EtherInput'
import { InvestFormSummary } from './Summary'
import { WncgInput } from './WncgInput'

type PoolInvestFormProps = {
  isNativeAsset: boolean
  selectEth(value: EthType): void
}

function PoolInvestForm({ isNativeAsset, selectEth }: PoolInvestFormProps) {
  const { getPriceImpact, getPropAmounts, getOptimizedAmounts } =
    useInvestMath()
  const { addModal } = useModal()
  const { calculateUsdValue } = useUsd()

  const userBalances = useAppSelector(getUserBalances)

  const wncgBalance = userBalances.wncg
  const ethNetBalance = isNativeAsset ? userBalances.eth : userBalances.weth
  const ethBalanceAvailable = isNativeAsset
    ? Math.max(new Decimal(ethNetBalance).minus(0.05).toNumber(), 0).toString()
    : ethNetBalance

  const { clearErrors, control, formState, setValue, trigger, watch } =
    useForm<InvestFormFields>({
      mode: 'onChange',
    })

  const ethValue = sanitizeNumber(watch('ethAmount'))
  const wncgValue = sanitizeNumber(watch('wncgAmount'))
  const amounts = useMemo(() => [wncgValue, ethValue], [ethValue, wncgValue])

  function setMaxValue(e: MouseEvent<HTMLButtonElement>) {
    const { value } = e.currentTarget as typeof e.currentTarget & {
      value: keyof InvestFormFields
    }
    const inputName = value
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

  function investOpt() {
    const propMaxAmounts = getOptimizedAmounts(isNativeAsset)
    setValue('wncgAmount', propMaxAmounts[0])
    setValue('ethAmount', propMaxAmounts[1])

    trigger()
  }

  function openInvestPreview(e: MouseEvent) {
    e.stopPropagation()

    addModal({
      category: ModalCategory.InvestPreview,
      props: {
        amounts,
        isNativeAsset,
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

  const maximized = useMemo(
    () =>
      new Decimal(wncgValue).eq(wncgBalance) &&
      !new Decimal(ethValue).isZero() &&
      new Decimal(ethValue).eq(ethBalanceAvailable),
    [ethBalanceAvailable, ethValue, wncgBalance, wncgValue]
  )

  const optimized = useMemo(() => {
    const propMaxAmounts = getOptimizedAmounts(isNativeAsset)
    return amounts.every((amount, i) =>
      new Decimal(amount).eq(propMaxAmounts[i])
    )
  }, [amounts, getOptimizedAmounts, isNativeAsset])

  const showPropButton = useMemo(() => {
    const hasError = !!Object.keys(formState.errors).length
    const wncg = new Decimal(wncgValue)
    const eth = new Decimal(ethValue)

    return {
      wncgAmount: !hasError && wncg.isZero() && !eth.isZero(),
      ethAmount: !hasError && eth.isZero() && !wncg.isZero(),
    }
  }, [ethValue, formState, wncgValue])

  const investDisabled = useMemo(
    () => new Decimal(wncgValue).isZero() && new Decimal(ethValue).isZero(),
    [ethValue, wncgValue]
  )

  const maxOptDisabled = useMemo(
    () =>
      new Decimal(wncgBalance).isZero() &&
      new Decimal(ethBalanceAvailable).isZero(),
    [ethBalanceAvailable, wncgBalance]
  )

  useEffect(() => {
    trigger('ethAmount')
  }, [isNativeAsset, trigger])

  return (
    <section className={styles.formSection}>
      <header className={styles.header}>
        <h3 className={styles.title}>Join pool</h3>
      </header>

      <form>
        <WncgInput
          clearErrors={clearErrors}
          control={control}
          formState={formState}
          setMaxValue={setMaxValue}
          setPropAmount={setPropAmount}
          showPropButton={showPropButton.wncgAmount}
          wncgValue={wncgValue}
          wncgBalance={wncgBalance}
          error={formState.errors?.wncgAmount?.message}
        />
        <EtherInput
          clearErrors={clearErrors}
          control={control}
          ethValue={ethValue}
          ethNetBalance={ethNetBalance}
          ethBalanceAvailable={ethBalanceAvailable}
          isNativeAsset={isNativeAsset}
          selectEth={selectEth}
          setMaxValue={setMaxValue}
          setPropAmount={setPropAmount}
          showPropButton={showPropButton.ethAmount}
          error={formState.errors?.ethAmount?.message}
        />
        <InvestFormSummary
          investMax={investMax}
          investOpt={investOpt}
          maximized={maximized}
          optimized={optimized}
          maxOptDisabled={maxOptDisabled}
          priceImpact={priceImpact}
          totalUsdValue={totalUsdValue}
        />
        <Button
          size="large"
          type="button"
          onClick={openInvestPreview}
          fullWidth
          disabled={investDisabled}
        >
          Preview
        </Button>
      </form>
    </section>
  )
}

export default memo(PoolInvestForm)
