import { memo } from 'react'
import { useForm } from 'react-hook-form'
import styles from '../styles/Form.module.scss'

import { sanitizeNumber } from 'utils/num'
import { useExitForm } from './useExitForm'
import { ExitFormFields } from './type'

import { Button } from 'components/Button'
import { TokenDropdown } from '../TokenInput/Dropdown'
import HighPriceImpact from '../HighPriceImpact'
import ExitFormSummary from './Summary'
import ProportionalExitInput from './ProportionalExitInput'
import SingleTokenExitInput from './SingleTokenExitInput'

function ExitForm() {
  const useFormReturn = useForm<ExitFormFields>({
    mode: 'onChange',
    defaultValues: {
      exitAmount: '',
      exitType: 'all',
      percentage: 100,
      priceImpactAgreement: false,
    },
  })

  const { clearErrors, control, formState, watch } = useFormReturn
  const {
    amountsOut,
    dropdownList,
    exactOut,
    togglePriceImpactAgreement,
    highPriceImpact,
    setExitType,
    openPreviewModal,
    previewDisabled,
    priceImpact,
    setMaxValue,
    singleAssetsMaxes,
    tokenOutIndex,
    totalFiatValue,
  } = useExitForm(useFormReturn)

  const exitAmount = sanitizeNumber(watch('exitAmount'))
  const exitType = watch('exitType')
  const percentage = watch('percentage')
  const priceImpactAgreement = watch('priceImpactAgreement')

  return (
    <section className={styles.formSection}>
      <header className={styles.header}>
        <h3 className={styles.title}>Exit pool</h3>
      </header>

      <form>
        <TokenDropdown
          id="exitType"
          className={styles.dropdown}
          selected={exitType}
          list={dropdownList}
          select={setExitType}
        />

        {exactOut ? (
          <SingleTokenExitInput
            clearErrors={clearErrors}
            control={control}
            setMaxValue={setMaxValue}
            singleAssetsMaxes={singleAssetsMaxes}
            tokenOutIndex={tokenOutIndex}
            value={exitAmount}
            error={formState.errors?.exitAmount?.message}
          />
        ) : (
          <ProportionalExitInput
            control={control}
            totalFiatValue={totalFiatValue}
            value={percentage}
          />
        )}

        <ExitFormSummary
          amountsOut={amountsOut}
          exactOut={exactOut}
          percentage={percentage}
          priceImpact={priceImpact}
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

export default memo(ExitForm)
