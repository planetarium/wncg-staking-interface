import { memo } from 'react'

import { bnum } from 'utils/bnum'
import { useFiat, useStaking } from 'hooks'
import { useFetchStaking, useFetchUserData } from 'hooks/queries'

import BonusRewards from './BonusRewards'
import SingleRewards from './SingleRewards'

type ExpectedRevenueProps = {
  amount?: string
}

function ExpectedRevenue({ amount = '0' }: ExpectedRevenueProps) {
  const toFiat = useFiat()
  const {
    lpToken,
    rewardTokenAddresses,
    totalStaked: initTotalStaked,
  } = useStaking()
  const { totalStaked } = useFetchStaking().data ?? {}
  const { stakedTokenBalance = '0' } = useFetchUserData().data ?? {}

  const hasBonusRewards = rewardTokenAddresses.length > 1

  const expectedTotalStaked = bnum(totalStaked ?? initTotalStaked)
    .plus(amount)
    .toString()
  const expectedTotalStakedValue = toFiat(expectedTotalStaked, lpToken?.address)
  const expectedStakedTokenBalance = bnum(stakedTokenBalance)
    .plus(amount)
    .toString()

  if (hasBonusRewards)
    return (
      <BonusRewards
        totalStakedFiatValue={expectedTotalStakedValue}
        stakedTokenBalance={expectedStakedTokenBalance}
      />
    )
  return (
    <SingleRewards
      totalStaked={expectedTotalStaked}
      stakedTokenBalance={expectedStakedTokenBalance}
    />
  )
}

export default memo(ExpectedRevenue)
