import { memo } from 'react'

import {
  useAllowances,
  useBalances,
  useClaimableTokens,
  useRewards,
  useStakedBalances,
  useTotalStaked,
} from 'hooks/contracts'

function ContractEffects() {
  useAllowances()
  useBalances()
  useClaimableTokens()
  useStakedBalances()
  useRewards()
  useTotalStaked()

  return null
}

export default memo(ContractEffects)
