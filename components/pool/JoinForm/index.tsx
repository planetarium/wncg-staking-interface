import { memo } from 'react'
import { useForm } from 'react-hook-form'
import styles from '../styles/Form.module.scss'

import { sanitizeNumber } from 'utils/num'
import { useJoinForm } from './useJoinForm'
import type { JoinFormFields } from './type'

import { Button } from 'components/Button'
import EtherInput from './EtherInput'
import JoinFormSummary from './Summary'
import WncgInput from './WncgInput'

type JoinFormProps = {
  isNativeAsset: boolean
  selectEth(value: EthType): void
}

function JoinForm({ isNativeAsset, selectEth }: JoinFormProps) {
  const useFormReturn = useForm<JoinFormFields>({
    mode: 'onChange',
  })
  const { clearErrors, control, formState, trigger, watch } = useFormReturn
  const {
    joinDisabled,
    joinMax,
    joinOpt,
    maximized,
    maxDisabled,
    openPreviewModal,
    optimized,
    optDisabled,
    priceImpact,
    setMaxValue,
    setPropAmount,
    showPropButton,
    totalUsdValue,
  } = useJoinForm(isNativeAsset, useFormReturn)

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
        <Button
          size="large"
          type="button"
          onClick={openPreviewModal}
          fullWidth
          disabled={joinDisabled}
        >
          Preview
        </Button>
      </form>
    </section>
  )
}

export default memo(JoinForm)
