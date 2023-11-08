import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchAprs } from 'lib/queries/fetchAprs'
import { useChain, useFiat, useStaking } from 'hooks'

import CountUp from 'components/CountUp'

type StakingDashboardRewardTokenAprProps = {
  totalStaked: string
}

function StakingDashboardRewardTokenApr({
  totalStaked,
}: StakingDashboardRewardTokenAprProps) {
  const { chainId } = useChain()
  const toFiat = useFiat()
  const { rewardTokenAddresses, tokens } = useStaking()
  const rewardTokenAddress = rewardTokenAddresses[0]
  const rewardTokenPrice = toFiat(1, rewardTokenAddress)

  const { data: aprs = [] } = useQuery(
    [
      QUERY_KEYS.Staking.Apr,
      chainId,
      totalStaked,
      rewardTokenPrice,
      rewardTokenAddress,
    ],
    () => fetchAprs(chainId, totalStaked),
    {
      suspense: true,
    }
  )

  const rewardToken = tokens[rewardTokenAddress]
  const rewardTokenApr = aprs[0]

  return (
    <div className="aprItem">
      <dt>{rewardToken.symbol} APR</dt>

      <dd className="colon">
        <CountUp
          value={rewardTokenApr}
          symbol="%"
          decimals={2}
          maxDecimals={2}
        />
      </dd>
    </div>
  )
}

export default StakingDashboardRewardTokenApr
