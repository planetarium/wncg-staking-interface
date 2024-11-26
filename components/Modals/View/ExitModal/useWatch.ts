import { useUnmount } from 'react-use'
import { atom, useAtom, useSetAtom } from 'jotai'
import { useWaitForTransaction } from 'wagmi'
import { isSameAddress } from '@balancer/sdk'

import { exitTxAtom } from 'states/tx'
import { NATIVE_CURRENCY_ADDRESS } from 'config/constants/addresses'
import { formatUnits } from 'utils/formatUnits'
import { parseLog } from 'utils/parseLog'
import { parseTransferLogs } from 'utils/parseTransferLogs'
import { useClientMount, useChain, useRefetch, useStaking } from 'hooks'

export const exitAmountsAtom = atom<string[]>([])

export function useWatch(send: XstateSend) {
  const { chainId, nativeCurrency } = useChain()
  const { poolTokenAddresses, poolTokenDecimals } = useStaking()

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

      const exitAmounts = poolTokenAddresses.map((addr, i) => {
        if (
          tx.exitType === NATIVE_CURRENCY_ADDRESS &&
          addr === nativeCurrency.wrappedTokenAddress
        ) {
          return formatUnits(
            withdrawalLog?.args[1] ?? '0',
            poolTokenDecimals[i]
          )
        }

        if (tx.exitType == null || isSameAddress(addr, tx.exitType)) {
          return formatUnits(transferLogs?.[addr] ?? '0', poolTokenDecimals[i])
        }

        return '0'
      })

      setExitAmounts(exitAmounts)
      setTx((prev) => ({ ...prev, amountsOut: exitAmounts }))
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
