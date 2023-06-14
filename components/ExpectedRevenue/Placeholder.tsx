import { StyledExpectedRevenueBonusRewards } from './styled'
import Skeleton from 'components/Skeleton'

function ExpectedRevenuePlaceholder() {
  return (
    <StyledExpectedRevenueBonusRewards className="revenueList">
      <ul className="revenueList">
        <li className="revenueItem">
          <Skeleton $height={68} />
        </li>
        <li className="revenueItem">
          <Skeleton $height={68} />
        </li>
        <li className="revenueItem">
          <Skeleton $height={68} />
        </li>
        <li className="revenueItem">
          <Skeleton $height={68} />
        </li>
      </ul>
    </StyledExpectedRevenueBonusRewards>
  )
}

export default ExpectedRevenuePlaceholder
