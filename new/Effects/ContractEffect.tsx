import { memo } from 'react'

import {
  useAllowances,
  useBalances,
  useClaimableTokens,
  useRewards,
  useStakedBalances,
  useTimestamps,
  useTotalStaked,
} from 'hooks/contracts'

function ContractEffects() {
  useAllowances()
  useBalances()
  useClaimableTokens()
  useStakedBalances()
  useRewards()
  useTimestamps()
  useTotalStaked()

  return null
}

export default memo(ContractEffects)
