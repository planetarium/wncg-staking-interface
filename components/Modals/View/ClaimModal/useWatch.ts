import { useUnmount } from 'react-use'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { claimTxAtom } from 'states/tx'
import { formatUnits } from 'utils/formatUnits'
import { parseTransferLogs } from 'utils/parseTransferLogs'
import { useChain, useClientMount, useRefetch, useStaking } from 'hooks'

export const claimedAmountsAtom = atom<string[]>([])

export function useWatch(send: XstateSend) {
  const { chainId } = useChain()
  const { rewardTokenAddresses, tokens } = useStaking()

  const transaction = useAtomValue(claimTxAtom)
  const setClaimedAmounts = useSetAtom(claimedAmountsAtom)

  const refetch = useRefetch({
    userData: true,
    userBalances: true,
  })

  useWaitForTransaction({
    hash: transaction.hash!,
    enabled: !!transaction.hash,
    suspense: false,
    chainId,
    async onSuccess(tx) {
      await refetch()
      const parsedLogs = parseTransferLogs(tx.logs)

      const claimedAmounts =
        transaction.rewardList?.map((check, i) => {
          if (!check) return '0'
          const addr = rewardTokenAddresses[i]

          return formatUnits(parsedLogs?.[addr], tokens?.[addr]?.decimals ?? 18)
        }) ?? []

      setClaimedAmounts(claimedAmounts)
      send('SUCCESS')
    },
    onError() {
      send('FAIL')
    },
  })

  useClientMount(() => {
    refetch()
    return
  })

  useUnmount(() => {
    refetch()
    return
  })
}
