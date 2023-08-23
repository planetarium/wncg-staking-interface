import { memo } from 'react'

import { useFetchStaking, useFetchUserData } from 'hooks/queries'

function ContractHook() {
  useFetchStaking({
    refetchInterval: 20 * 1_000,
  })

  useFetchUserData({
    refetchInterval: 30 * 1_000,
  })

  return null
}

export default memo(ContractHook)
