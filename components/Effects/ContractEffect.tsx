import { memo } from 'react'

import {
  useAllowances,
  useBalances,
  useClaimableTokens,
  useRewards,
  useStakedBalances,
  useStakingContractData,
  useTimestamps,
  useTotalStaked,
} from 'hooks/contracts'

function ContractEffects() {
  useAllowances()
  useBalances()
  useClaimableTokens()
  useRewards()
  useStakedBalances()
  useStakingContractData()
  useTimestamps()
  useTotalStaked()

  return null
}

export default memo(ContractEffects)
