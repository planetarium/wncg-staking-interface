import { useCallback } from 'react'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { useSetAtom } from 'jotai'

import { harvestTxAtom } from 'states/tx'
import config from 'config'
import { LiquidityGaugeAbi } from 'config/abi'
import { useSwitchNetwork } from './useSwitchNetwork'
import { useToast } from './useToast'
import { ToastType } from 'config/constants'
import { useFetchStaking } from './queries'
import { useStaking } from './useStaking'

export function useHarvest() {
  const { switchBeforeSend } = useSwitchNetwork()
  const { liquidityGaugeAddress } = useStaking()
  const toast = useToast()

  const setTx = useSetAtom(harvestTxAtom)
  const { claimableTokens = '0' } = useFetchStaking().data ?? {}

  const { config: writeConfig } = usePrepareContractWrite({
    address: liquidityGaugeAddress,
    abi: LiquidityGaugeAbi,
    chainId: config.chainId,
    functionName: 'claim_rewards',
    onError: switchBeforeSend,
  })

  const { writeAsync } = useContractWrite(writeConfig)

  const harvest = useCallback(async () => {
    try {
      const res = await writeAsync?.()
      if (!res?.hash) return

      const props = {
        hash: res.hash,
        harvestAmount: claimableTokens,
      }

      setTx(props)
      toast<HarvestTx>({
        type: ToastType.Harvest,
        props,
      })
    } catch (error: any) {
      if (
        error.code === 'ACTION_REJECTED' ||
        error.code === 4001 ||
        error.error === 'Rejected by user'
      ) {
        return
      }
      throw error
    }
  }, [claimableTokens, setTx, toast, writeAsync])

  return writeAsync ? harvest : null
}
