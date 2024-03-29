import dynamic from 'next/dynamic'

import { bnum } from 'utils/bnum'
import { useFiat, useStaking } from 'hooks'
import { useFetchTotalStaked, useFetchUserData } from 'hooks/queries'

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
    totalStaked: defaultTotalStaked,
  } = useStaking()
  const totalStaked = useFetchTotalStaked().data ?? defaultTotalStaked
  const { stakedTokenBalance = '0' } = useFetchUserData().data ?? {}

  const hasBonusRewards = rewardTokenAddresses.length > 1

  const expectedTotalStaked = bnum(totalStaked).plus(amount).toString()
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

export default dynamic(() => Promise.resolve(ExpectedRevenue), {
  ssr: false,
})
