import { memo } from 'react'

import { StyledExitModalPage1Step3 } from './styled'
import HighPriceImpact from 'new/HighPriceImpact'
import RektPriceImpact from 'new/RektPriceImpact'

type ExitModalPage1Step3Props = {
  priceImpact: number
  priceImpactAgreement: boolean
  togglePriceImpactAgreement(value: boolean): void
}

function ExitModalPage1Step3({
  priceImpact,
  priceImpactAgreement,
  togglePriceImpactAgreement,
}: ExitModalPage1Step3Props) {
  const priceImpactPcnt = (priceImpact * 100).toFixed(2)

  return (
    <StyledExitModalPage1Step3>
      <header className="header">
        <span className="count">3</span>
        <h4 className="title">Check price impact</h4>
        <strong className="pcnt">{priceImpactPcnt}%</strong>
      </header>

      <HighPriceImpact
        checked={priceImpactAgreement}
        priceImpact={priceImpact}
        toggle={togglePriceImpactAgreement}
      />
      <RektPriceImpact action="exit" priceImpact={priceImpact} />
    </StyledExitModalPage1Step3>
  )
}

export default memo(ExitModalPage1Step3)
