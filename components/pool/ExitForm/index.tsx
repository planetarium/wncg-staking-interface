import { memo } from 'react'
import { useForm } from 'react-hook-form'
import styles from '../styles/Form.module.scss'

import { sanitizeNumber } from 'utils/num'
import { useExitForm } from './useExitForm'
import { ExitFormFields } from './type'

import { Button } from 'components/Button'
import { TokenDropdown } from '../TokenInput/Dropdown'
import HighPriceImpact from '../HighPriceImpact'
import Slippage from '../Slippage'
import ExitFormSummary from './Summary'
import ProportionalExitInput from './ProportionalExitInput'
import SingleTokenExitInput from './SingleTokenExitInput'

function ExitForm() {
  const useFormReturn = useForm<ExitFormFields>({
    mode: 'onChange',
    defaultValues: {
      tokenOutAmount: '',
      exitType: 'all',
      percent: 100,
      priceImpactAgreement: false,
    },
  })

  const { clearErrors, control, formState, trigger, watch } = useFormReturn
  const {
    amountsOut,
    dropdownList,
    togglePriceImpactAgreement,
    highPriceImpact,
    isProportional,
    setExitType,
    openPreviewModal,
    previewDisabled,
    priceImpact,
    setMaxValue,
    singleAssetsMaxes,
    tokenOutIndex,
    totalFiatValue,
  } = useExitForm(useFormReturn)

  const tokenOutAmount = sanitizeNumber(watch('tokenOutAmount'))
  const exitType = watch('exitType')
  const percent = watch('percent')
  const priceImpactAgreement = watch('priceImpactAgreement')

  return (
    <section className={styles.formSection}>
      <header className={styles.header}>
        <h3 className={styles.title}>Exit pool</h3>
        <Slippage />
      </header>

      <form>
        <TokenDropdown
          id="exitType"
          className={styles.dropdown}
          selected={exitType}
          list={dropdownList}
          select={setExitType}
        />

        {isProportional ? (
          <ProportionalExitInput
            control={control}
            totalFiatValue={totalFiatValue}
            value={percent}
          />
        ) : (
          <SingleTokenExitInput
            clearErrors={clearErrors}
            control={control}
            setMaxValue={setMaxValue}
            singleAssetsMaxes={singleAssetsMaxes}
            tokenOutIndex={tokenOutIndex}
            trigger={trigger}
            value={tokenOutAmount}
            error={formState.errors?.tokenOutAmount?.message}
          />
        )}

        <ExitFormSummary
          amountsOut={amountsOut}
          isProportional={isProportional}
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
