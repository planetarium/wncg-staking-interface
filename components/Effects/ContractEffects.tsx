import { memo } from 'react'

import {
  useAllowances,
  useBalances,
  useClaimableTokens,
  useRewards,
  useStakedBalances,
  useStaking,
  useTotalStaked,
} from 'hooks/contracts'

function ContractEffects() {
  useAllowances()
  useBalances()
  useClaimableTokens()
  useStakedBalances()
  useStaking()
  useRewards()
  useTotalStaked()

  return null
}

export default memo(ContractEffects)
