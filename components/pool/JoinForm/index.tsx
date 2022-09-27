import { memo } from 'react'
import { useForm } from 'react-hook-form'
import styles from '../styles/Form.module.scss'

import { configService } from 'services/config'
import { useBalances, usePool } from 'hooks'
import { useJoinForm } from './useJoinForm'
import type { JoinFormFields } from './type'

import { Button } from 'components/Button'
import HighPriceImpact from '../HighPriceImpact'
import Slippage from '../Slippage'
import EtherInput from './EtherInput'
import JoinFormSummary from './Summary'
import WncgInput from './WncgInput'

type JoinFormProps = {
  currentEther: string
  selectEther(value: string): void
}

function JoinForm({ currentEther, selectEther }: JoinFormProps) {
  const { balanceFor } = useBalances()
  const { ercTokenIndex, nativeAssetIndex, poolTokenAddresses } = usePool()

  const isNativeAsset = currentEther === configService.nativeAssetAddress

  const useFormReturn = useForm<JoinFormFields>({
    mode: 'onChange',
    defaultValues: {
      ethAmount: '',
      wncgAmount: '',
      priceImpactAgreement: false,
    },
  })
  const { clearErrors, control, formState, trigger, watch } = useFormReturn
  const {
    ethMaximized,
    highPriceImpact,
    joinMax,
    joinOpt,
    maximized,
    maxDisabled,
    openPreviewModal,
    optimized,
    optDisabled,
    previewDisabled,
    priceImpact,
    setMaxValue,
    setPropAmount,
    showPropButton,
    togglePriceImpactAgreement,
    totalFiatValue,
    tokenFiatValues,
    wncgIndex,
    wncgMaximized,
  } = useJoinForm(isNativeAsset, useFormReturn)

  const ethValue = watch('ethAmount')
  const priceImpactAgreement = watch('priceImpactAgreement')

  return (
    <section className={styles.formSection}>
      <header className={styles.header}>
        <h3 className={styles.title}>Join pool</h3>
        <Slippage />
      </header>

      <form>
        <WncgInput
          address={poolTokenAddresses[wncgIndex]}
          balance={balanceFor(poolTokenAddresses[wncgIndex])}
          clearErrors={clearErrors}
          control={control}
          maximized={wncgMaximized}
          setMaxValue={setMaxValue}
          setPropAmount={setPropAmount}
          showPropButton={showPropButton.wncgAmount}
          trigger={trigger}
          error={formState.errors?.wncgAmount?.message}
          fiatValue={tokenFiatValues[ercTokenIndex]}
        />
        <EtherInput
          clearErrors={clearErrors}
          control={control}
          currentEther={currentEther}
          isNativeAsset={isNativeAsset}
          maximized={ethMaximized}
          showPropButton={showPropButton.ethAmount}
          selectEther={selectEther}
          setMaxValue={setMaxValue}
          setPropAmount={setPropAmount}
          trigger={trigger}
          value={ethValue}
          error={formState.errors?.ethAmount?.message}
          fiatValue={tokenFiatValues[nativeAssetIndex]}
        />
        <JoinFormSummary
          joinMax={joinMax}
          joinOpt={joinOpt}
          maximized={maximized}
          optimized={optimized}
          maxDisabled={maxDisabled}
          optDisabled={optDisabled}
          priceImpact={priceImpact}
          totalFiatValue={totalFiatValue}
        />
        <HighPriceImpact
          checked={priceImpactAgreement}
          handleCheck={togglePriceImpactAgreement}
          required={highPriceImpact}
        />
        <Button
          size="large"
          type="button"
          onClick={openPreviewModal}
          fullWidth
          disabled={previewDisabled}
        >
          Preview
        </Button>
      </form>
    </section>
  )
}

export default memo(JoinForm)
