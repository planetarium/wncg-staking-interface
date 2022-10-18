import { REKT_PRICE_IMPACT } from 'constants/poolLiquidity'

import Alert from './Alert'

type JoinFormRektPriceImpactProps = {
  priceImpact: number
}

function JoinFormRektPriceImpact({
  priceImpact,
}: JoinFormRektPriceImpactProps) {
  const rektPriceImpact = priceImpact >= REKT_PRICE_IMPACT

  return (
    <Alert
      className="rektPriceImpact"
      show={rektPriceImpact}
      message="If the price impact exceeds 20%, join pool cannot be performed"
    />
  )
}

export default JoinFormRektPriceImpact
