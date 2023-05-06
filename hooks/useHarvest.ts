import { useCallback } from 'react'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { useSetAtom } from 'jotai'

import { showHarvestTooltipAtom } from 'states/system'
import { harvestTxAtom } from 'states/tx'
import config from 'config'
import { StakingAbi } from 'config/abi'
import { ToastType } from 'config/constants'
import { useSwitchNetwork } from './useSwitchNetwork'
import { useToast } from './useToast'
import { useStaking } from './useStaking'
import { useFetchStaking } from './queries'

export function useHarvest() {
  const { switchBeforeSend } = useSwitchNetwork()
  const { liquidityGaugeAddress } = useStaking()
  const toast = useToast()
  console.log(liquidityGaugeAddress)

  const setTx = useSetAtom(harvestTxAtom)
  const setShowHarvestTooltip = useSetAtom(showHarvestTooltipAtom)

  const { claimableTokens = '0' } = useFetchStaking().data ?? {}

  const { config: writeConfig } = usePrepareContractWrite({
    address: config.stakingAddress,
    abi: StakingAbi,
    chainId: config.chainId,
    functionName: 'earmarkRewards',
    onError: switchBeforeSend,
  })

  const { writeAsync } = useContractWrite(writeConfig)

  const harvest = useCallback(async () => {
    try {
      const res = await writeAsync?.()
      setShowHarvestTooltip(false)
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
      setShowHarvestTooltip(false)
      if (
        error.code === 'ACTION_REJECTED' ||
        error.code === 4001 ||
        error.error === 'Rejected by user'
      ) {
        return
      }
      throw error
    }
  }, [claimableTokens, setShowHarvestTooltip, setTx, toast, writeAsync])

  return writeAsync ? harvest : null
}
