import { bnum } from 'utils/bnum'
import { useStaking } from 'hooks'
import { useFetchStaking } from 'hooks/queries'

import BonusRewards from './BonusRewards'
import SingleRewards from './SingleRewards'

type StakeFormRevenueProps = {
  amount: string
  className?: string
}

export default function StakeFormRevenuePopup({
  amount,
  className,
}: StakeFormRevenueProps) {
  const { rewardTokenAddresses } = useStaking()

  const { totalStaked = '0' } = useFetchStaking().data ?? {}

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
