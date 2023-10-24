import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchAprs } from 'lib/queries/fetchAprs'
import { useChain, useStaking } from 'hooks'

import CountUp from 'components/CountUp'

type StakingDashboardRewardTokenAprProps = {
  totalStaked: string
}

function StakingDashboardRewardTokenApr({
  totalStaked,
}: StakingDashboardRewardTokenAprProps) {
  const { chainId } = useChain()
  const { rewardTokenAddresses, tokens } = useStaking()

  const { data: aprs = [] } = useQuery(
    [QUERY_KEYS.Staking.Apr, chainId, totalStaked],
    () => fetchAprs(chainId, totalStaked),
    {
      cacheTime: Infinity,
      suspense: true,
      refetchOnWindowFocus: 'always',
    }
  )

  const rewardToken = tokens[rewardTokenAddresses[0]]
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
