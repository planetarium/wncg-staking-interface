import { memo } from 'react'

import { useResponsive } from 'hooks'

import { StyledExpectedRevenue } from './styled'
import Skeleton from 'components/Skeleton'

const LIST = ['day', 'week', 'month', 'year']

function ExpectedRevenueFallback() {
  const { isHandheld } = useResponsive()

  if (isHandheld) {
    return (
      <StyledExpectedRevenue className="revenueList">
        {LIST.map((span) => {
          return (
            <div className="revenueItem" key={`revenueMap:${span}`}>
              <dt>
                <Skeleton $width={64} $height={18 - 4} $mb={4} />
              </dt>

              <dd className="value">
                <div className="valueItem">
                  <div className="label">
                    <Skeleton $width={72} $height={18 - 8} $mt={8} />
                  </div>

                  <Skeleton $width={132} $height={18 - 8} $mt={8} />
                </div>

                <div className="valueItem">
                  <div className="label">
                    <Skeleton $width={64} $height={18 - 8} $mt={8} />
                  </div>

                  <Skeleton $width={120} $height={18 - 8} $mt={8} />
                </div>
              </dd>
            </div>
          )
        })}
      </StyledExpectedRevenue>
    )
  }

  return (
    <StyledExpectedRevenue className="revenueList">
      {LIST.map((span) => {
        return (
          <div className="revenueItem" key={`revenueMap:${span}`}>
            <dt>
              <Skeleton $width={64} $height={20 - 4} $mb={4} />
            </dt>

            <dd className="value">
              <div className="valueItem">
                <div className="label">
                  <Skeleton $width={100} $height={20 - 6} $mt={6} />
                </div>

                <Skeleton $width={80} $height={18 - 8} $mt={8} />
              </div>

              <div className="valueItem">
                <div className="label">
                  <Skeleton $width={120} $height={20 - 8} $mt={8} />
                </div>

                <Skeleton $width={96} $height={18 - 8} $mt={8} />
              </div>
            </dd>
          </div>
        )
      })}
    </StyledExpectedRevenue>
  )
}

export default memo(ExpectedRevenueFallback)
