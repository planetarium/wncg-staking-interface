import { useEffect, useMemo } from 'react'
import { usePrevious } from 'react-use'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import type { BigNumber } from 'ethers'
import { useContractReads } from 'wagmi'
import { isPast } from 'date-fns'

import { pendingCooldownTxAtom } from 'states/form'
import { stakingContractAddressAtom } from 'states/staking'
import { timestampsAtom } from 'states/user'
import { createLogger } from 'utils/log'
import { networkChainId } from 'utils/network'
import { findAbiFromStaking } from 'utils/wagmi'
import { useAccount } from '../useAccount'
import { useStakedBalance } from '../useStakedBalance'

const log = createLogger(`black`)

const FNS = ['getCooldownEndTimestamp', 'getWithdrawEndTimestamp']
const ABIS = findAbiFromStaking(...FNS)

export function useTimestamps() {
  const { account } = useAccount()
  const { hasStakedBalance } = useStakedBalance()

  const stakingAddress = useAtomValue(stakingContractAddressAtom)
  const setPendingTx = useSetAtom(pendingCooldownTxAtom)
  const [timestamps, setTimestamps] = useAtom(timestampsAtom)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const prevTimestamps = usePrevious(timestamps) || [0, 0]

  const contracts = useMemo(
    () =>
      FNS.map((fn) => ({
        address: stakingAddress,
        abi: ABIS,
        functionName: fn,
        chainId: networkChainId,
        args: [account!],
      })),
    [account, stakingAddress]
  )

  useContractReads({
    contracts,
    enabled: !!account && hasStakedBalance,
    watch: true,
    onSettled() {
      log(`timestamps`)
    },
    onSuccess(data: unknown = []) {
      const timestamps = (data as BigNumber[]).map((timestamp) => {
        let timestampInMs = timestamp?.toNumber() * 1_000 || 0
        if (isPast(timestampInMs)) timestampInMs = 0
        return timestampInMs
      })
      setPendingTx(RESET)
      setTimestamps(timestamps)
    },
  })

  useEffect(() => {
    if (prevTimestamps.some((t, i) => timestamps[i] !== t)) {
      setPendingTx(RESET)
    }
  }, [prevTimestamps, setPendingTx, timestamps])
}
