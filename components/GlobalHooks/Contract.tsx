import { memo } from 'react'

import { useFetchStaking, useFetchUserData } from 'hooks/queries'

function ContractHook() {
  useFetchStaking({
    refetchInterval: 30 * 1_000,
    suspense: false,
  })

  useFetchUserData({
    refetchInterval: 30 * 1_000,
    suspense: false,
  })

  return null
}

export default memo(ContractHook)
