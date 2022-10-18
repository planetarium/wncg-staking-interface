import { AnimatePresence } from 'framer-motion'

import { slideInDown } from 'constants/motionVariants'
import { HIGH_PRICE_IMPACT, REKT_PRICE_IMPACT } from 'constants/poolLiquidity'

import { StyledJoinFormHighPriceImpact } from './styled'
import Checkbox from 'new/Checkbox'

type JoinFormHighPriceImpactProps = {
  checked: boolean
  priceImpact: number
  toggle(value: boolean): void
}

function JoinFormHighPriceImpact({
  checked,
  priceImpact,
  toggle,
}: JoinFormHighPriceImpactProps) {
  const show =
    priceImpact >= HIGH_PRICE_IMPACT && priceImpact < REKT_PRICE_IMPACT

  return (
    <AnimatePresence>
      {show && (
        <StyledJoinFormHighPriceImpact
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
        </StyledJoinFormHighPriceImpact>
      )}
    </AnimatePresence>
  )
}

export default JoinFormHighPriceImpact
