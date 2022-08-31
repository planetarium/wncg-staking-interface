import { memo } from 'react'
import { useForm } from 'react-hook-form'
import styles from '../styles/Form.module.scss'

import { configService } from 'services/config'
import { sanitizeNumber } from 'utils/num'
import { useBalances, usePool } from 'hooks'
import { useJoinForm } from './useJoinForm'
import type { JoinFormFields } from './type'

import { Button } from 'components/Button'
import EtherInput from './EtherInput'
import HighPriceImpact from './HighPriceImpact'
import JoinFormSummary from './Summary'
import WncgInput from './WncgInput'

type JoinFormProps = {
  currentEther: string
  selectEther(value: string): void
}

function JoinForm({ currentEther, selectEther }: JoinFormProps) {
  const { balanceFor } = useBalances()
  const { poolTokenAddresses } = usePool()

  const isNativeAsset = currentEther === configService.nativeAssetAddress

  const useFormReturn = useForm<JoinFormFields>({
    mode: 'onChange',
    defaultValues: {
      priceImpactAgreement: false,
    },
  })
  const { clearErrors, control, formState, trigger, watch } = useFormReturn
  const {
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
    totalUsdValue,
  } = useJoinForm(isNativeAsset, useFormReturn)

  const ethValue = sanitizeNumber(watch('ethAmount'))
  const wncgValue = sanitizeNumber(watch('wncgAmount'))
  const priceImpactAgreement = watch('priceImpactAgreement')

  return (
    <section className={styles.formSection}>
      <header className={styles.header}>
        <h3 className={styles.title}>Join pool</h3>
      </header>

      <form>
        <WncgInput
          address={poolTokenAddresses[0]}
          balance={balanceFor(poolTokenAddresses[0])}
          clearErrors={clearErrors}
          control={control}
          setMaxValue={setMaxValue}
          setPropAmount={setPropAmount}
          showPropButton={showPropButton.wncgAmount}
          value={wncgValue}
          error={formState.errors?.wncgAmount?.message}
        />
        <EtherInput
          clearErrors={clearErrors}
          control={control}
          currentEther={currentEther}
          isNativeAsset={isNativeAsset}
          showPropButton={showPropButton.ethAmount}
          selectEther={selectEther}
          setMaxValue={setMaxValue}
          setPropAmount={setPropAmount}
          trigger={trigger}
          value={ethValue}
          error={formState.errors?.ethAmount?.message}
        />
        <JoinFormSummary
          joinMax={joinMax}
          joinOpt={joinOpt}
          maximized={maximized}
          optimized={optimized}
          maxDisabled={maxDisabled}
          optDisabled={optDisabled}
          priceImpact={priceImpact}
          totalUsdValue={totalUsdValue}
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
