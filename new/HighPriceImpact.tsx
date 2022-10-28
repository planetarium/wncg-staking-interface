import { AnimatePresence } from 'framer-motion'

import { slideInDown } from 'constants/motionVariants'
import { HIGH_PRICE_IMPACT, REKT_PRICE_IMPACT } from 'constants/poolLiquidity'

import { StyledHighPriceImpact } from './styled'
import Checkbox from 'new/Checkbox'

type HighPriceImpactProps = {
  checked: boolean
  priceImpact: number
  toggle(value: boolean): void
}

function HighPriceImpact({
  checked,
  priceImpact,
  toggle,
}: HighPriceImpactProps) {
  const show =
    priceImpact >= HIGH_PRICE_IMPACT && priceImpact < REKT_PRICE_IMPACT

  return (
    <AnimatePresence>
      {show && (
        <StyledHighPriceImpact
          className="highPriceImpact"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={slideInDown}
          role="alert"
        >
          <h4 className="title">
            Users with a price impact of 1% to 19.99% must agree to the
            following.
          </h4>
          <p className="desc">
            I accept the high price impact from depositing single token amounts,
            <br />
            moving the market price based on the depth of the market.
          </p>

          <div className="checkboxGroup">
            <label className="label" htmlFor="highPriceImpactAgreement">
              I agree
            </label>
            <Checkbox
              id="highPriceImpactAgreement"
              className="checkbox"
              checked={checked}
              onChange={toggle}
            />
          </div>
        </StyledHighPriceImpact>
      )}
    </AnimatePresence>
  )
}

export default HighPriceImpact
