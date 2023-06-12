import { memo } from 'react'
import {
  UseFormSetValue,
  UseFormStateReturn,
  UseFormWatch,
} from 'react-hook-form'
import clsx from 'clsx'

import { HIGH_PRICE_IMPACT } from 'config/constants/liquidityPool'
import { ExitFormFields } from 'hooks/useExitForm'

import { StyledExitModalPage1Step3 } from './styled'
import HighPriceImpact from 'components/HighPriceImpact'
import NumberFormat from 'components/NumberFormat'
import RektPriceImpact from 'components/RektPriceImpact'

type ExitModalPage1Step3Props = {
  hash?: Hash
  priceImpact: number
  setValue: UseFormSetValue<ExitFormFields>
  watch: UseFormWatch<ExitFormFields>
  formState: UseFormStateReturn<ExitFormFields>
}

function ExitModalPage1Step3({
  hash,
  priceImpact,
  setValue,
  watch,
  formState,
}: ExitModalPage1Step3Props) {
  const priceImpactPcnt = (priceImpact * 100).toFixed(2)
  const priceImpactAgreement = watch('priceImpactAgreement') ?? false

  function toggle() {
    setValue('priceImpactAgreement', !priceImpactAgreement)
  }

  const showAler = priceImpact > HIGH_PRICE_IMPACT
  const hasError = Object.keys(formState.errors).length > 0

  return (
    <StyledExitModalPage1Step3 $disabled={!!hash}>
      <header className="header">
        <span className="count">3</span>
        <h4 className="title">Check price impact</h4>

        <NumberFormat
          className={clsx('pcnt', { alert: showAler })}
          value={priceImpactPcnt}
          type="percent"
        />
      </header>

      {!hasError && (
        <HighPriceImpact
          checked={priceImpactAgreement}
          priceImpact={priceImpact}
          toggle={toggle}
          disabled={!!hash}
        />
      )}

      <RektPriceImpact
        action="exit"
        priceImpact={priceImpact}
        disabled={!!hash}
      />
    </StyledExitModalPage1Step3>
  )
}

export default memo(ExitModalPage1Step3)
