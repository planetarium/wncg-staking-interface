import { memo } from 'react'
import { useForm } from 'react-hook-form'
import styles from '../styles/Form.module.scss'

import { sanitizeNumber } from 'utils/num'
import { useInvestForm } from './useInvestForm'
import type { InvestFormFields } from './type'

import { Button } from 'components/Button'
import EtherInput from './EtherInput'
import InvestFormSummary from './Summary'
import WncgInput from './WncgInput'

type PoolInvestFormProps = {
  isNativeAsset: boolean
  selectEth(value: EthType): void
}

function PoolInvestForm({ isNativeAsset, selectEth }: PoolInvestFormProps) {
  const useFormReturn = useForm<InvestFormFields>({
    mode: 'onChange',
  })
  const { clearErrors, control, formState, trigger, watch } = useFormReturn
  const {
    investDisabled,
    investMax,
    investOpt,
    maximized,
    maxOptDisabled,
    openPreviewModal,
    optimized,
    priceImpact,
    setMaxValue,
    setPropAmount,
    showPropButton,
    totalUsdValue,
  } = useInvestForm(isNativeAsset, useFormReturn)

  const ethValue = sanitizeNumber(watch('ethAmount'))
  const wncgValue = sanitizeNumber(watch('wncgAmount'))

  return (
    <section className={styles.formSection}>
      <header className={styles.header}>
        <h3 className={styles.title}>Join pool</h3>
      </header>

      <form>
        <WncgInput
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
          isNativeAsset={isNativeAsset}
          showPropButton={showPropButton.ethAmount}
          selectEth={selectEth}
          setMaxValue={setMaxValue}
          setPropAmount={setPropAmount}
          trigger={trigger}
          value={ethValue}
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
          onClick={openPreviewModal}
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
