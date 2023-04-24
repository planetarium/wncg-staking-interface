import { useQueryClient } from '@tanstack/react-query'
import config from 'config'

import { queryKeys } from 'config/queryKeys'

export function useStaking() {
  const queryClient = useQueryClient()

  const data = queryClient.getQueryData<BuildResponse>([queryKeys.Build], {
    exact: false,
  }) ?? {
    tokenMap: {},
    pool: {
      id: config.poolId,
      address: '' as Hash,
      createTime: 0,
      factory: '',
      symbol: '',
      name: '',
      swapFee: '',
      owner: '',
      totalLiquidity: '',
      totalShares: '',
      totalSwapFee: '',
      totalSwapVolume: '',
      tokens: [],
      tokensList: [],
    },
    bptAddress: '' as Hash,
    bptTotalSupply: '',
    bptSymbol: '',
    bptName: '',
    bptDecimals: 18,
    poolId: config.poolId,
    poolSwapFee: '',
    poolTotalLiquidity: '',
    poolTotalSwapVolume: '',
    poolTotalSwapFee: '',
    poolTokens: [],
    poolTokenAddresses: [],
    poolTokenBalances: [],
    poolTokenDecimals: [],
    poolTokenWeights: [],
    poolTokenWeightsInPcnt: [],
    poolTokenSymbols: [],
    cooldownPeriod: 0,
    earmarkIncentivePcnt: 0.01,
    liquidityGaugeAddress: '' as Hash,
    rewardEmissions: [],
    rewardTokenAddress: '' as Hash,
    rewardTokenAddresses: [],
    stakedTokenAddress: '' as Hash,
    unstakePeriod: 0,
    totalStaked: '',
  }

  return data as BuildResponse
}
