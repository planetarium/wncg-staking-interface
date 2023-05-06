import Skeleton from 'components/Skeleton'
import { StyledExpectedRevenue } from './styled'

function ExpectedRevenuePlaceholder() {
  return (
    <StyledExpectedRevenue className="revenueList">
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
    </StyledExpectedRevenue>
  )
}

export default ExpectedRevenuePlaceholder
