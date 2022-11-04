import { useEffect, useMemo } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { useContractReads } from 'wagmi'

import { stakingContractAddressAtom, stakingDataAtom } from 'states/staking'
import { associateStakingContractData } from 'utils/contract'
import { createLogger } from 'utils/log'
import { networkChainId } from 'utils/network'
import { findAbiFromStaking } from 'utils/wagmi'

const log = createLogger(`black`)

const FNS = [
  'earmarkIncentive',
  'FEE_DENOMINATOR',
  'balancerGauge',
  'REWARD_TOKEN',
  'STAKED_TOKEN',
  'getBALRewardRate',
  'getWNCGEmissionPerSec',
  'COOLDOWN_SECONDS',
  'UNSTAKE_WINDOW',
]
const ABIS = findAbiFromStaking(...FNS)

export function useStakingContractData() {
  const [stakingData, setStakingContractData] = useAtom(stakingDataAtom)
  const stakingAddress = useAtomValue(stakingContractAddressAtom)

  const contracts = useMemo(
    () =>
      FNS.map((fn) => ({
        address: stakingAddress,
        abi: ABIS,
        functionName: fn,
        chainId: networkChainId,
      })),
    [stakingAddress]
  )

  const { data } = useContractReads({
    contracts,
    cacheTime: Infinity,
    staleTime: stakingData == null ? undefined : Infinity,
    enabled: !!stakingAddress && stakingData == null,
    onSettled() {
      log(`staking`)
    },
  })

  useEffect(() => {
    if (!stakingData) setStakingContractData(associateStakingContractData(data))
  }, [stakingData, setStakingContractData, data])
}
