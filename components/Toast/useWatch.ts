import { useEffect, useState } from 'react'
import { useUnmount } from 'react-use'
import { toast } from 'react-toastify'
import { useWaitForTransaction } from 'wagmi'

import config from 'config'
import { useRefetch } from 'hooks'

export function useWatch(hash: Hash) {
  const [status, setStatus] = useState<null | 0 | 1>(null)

  const refetch = useRefetch({
    userData: true,
    staking: true,
    pool: true,
    poolSnapshot: true,
    userBalances: true,
    userAllowances: true,
  })

  useWaitForTransaction({
    enabled: !!hash,
    hash,
    chainId: config.chainId,
    suspense: false,
    async onSuccess() {
      setStatus(1)
      refetch()
    },
    async onError() {
      setStatus(0)
    },
  })

  useEffect(() => {
    if (status != null) {
      toast.update(`toast:${hash}`, { autoClose: 5 * 1_000 })
    }
  }, [hash, status])

  useUnmount(() => {
    if (status == null) refetch()
  })

  return status
}
