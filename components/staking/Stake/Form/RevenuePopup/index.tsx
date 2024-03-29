import dynamic from 'next/dynamic'

import { bnum } from 'utils/bnum'
import { useStaking } from 'hooks'
import { useFetchTotalStaked } from 'hooks/queries'

import BonusRewards from './BonusRewards'
import SingleRewards from './SingleRewards'

type StakeFormRevenueProps = {
  amount: string
  className?: string
}

function StakeFormRevenuePopup({ amount, className }: StakeFormRevenueProps) {
  const { rewardTokenAddresses, totalStaked: defaultTotalStaked } = useStaking()

  const totalStaked = useFetchTotalStaked().data ?? defaultTotalStaked

  const expectedTotalStaked = bnum(totalStaked)
    .plus(bnum(amount).toString())
    .toString()

  const hasBonusRewards = rewardTokenAddresses.length > 1

  if (hasBonusRewards)
    return (
      <BonusRewards
        className={className}
        amount={amount}
        expectedTotalStaked={expectedTotalStaked}
      />
    )

  return (
    <SingleRewards
      className={className}
      amount={amount}
      expectedTotalStaked={expectedTotalStaked}
    />
  )
}

export default dynamic(() => Promise.resolve(StakeFormRevenuePopup), {
  ssr: false,
})
