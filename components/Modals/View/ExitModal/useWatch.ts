import { useUnmount } from 'react-use'
import { atom, useAtom, useSetAtom } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { exitTxAtom } from 'states/tx'
import { NATIVE_CURRENCY_ADDRESS } from 'config/constants/addresses'
import { formatUnits } from 'utils/formatUnits'
import { parseLog } from 'utils/parseLog'
import { parseTransferLogs } from 'utils/parseTransferLogs'
import { useClientMount, useChain, useRefetch, useStaking } from 'hooks'

export const exitAmountsAtom = atom<string[]>([])

export function useWatch(send: XstateSend) {
  const { chainId } = useChain()
  const { poolTokenDecimals } = useStaking()

  const refetch = useRefetch({
    userBalances: true,
    pool: true,
    userData: true,
  })

  const [tx, setTx] = useAtom(exitTxAtom)
  const setExitAmounts = useSetAtom(exitAmountsAtom)

  useWaitForTransaction({
    hash: tx.hash!,
    enabled: !!tx.hash,
    chainId,
    suspense: false,
    async onSuccess(_tx) {
      const parsedLogs = _tx.logs.map((l) => parseLog(l))
      const transferLogs = parseTransferLogs(_tx.logs)
      const withdrawalLog = parsedLogs.find((l) => l?.name === 'Withdrawal')

      const exitAmounts = tx.assets!.map((addr, i) => {
        if (!tx.isPropExit && addr === NATIVE_CURRENCY_ADDRESS) {
          return formatUnits(
            withdrawalLog?.args[1] ?? '0',
            poolTokenDecimals[i]
          )
        }

        return formatUnits(transferLogs?.[addr] ?? '0', poolTokenDecimals[i])
      })

      setExitAmounts(exitAmounts)
      setTx((prev) => ({ ...prev, exitAmounts }))
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
