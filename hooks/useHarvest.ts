import { useCallback } from 'react'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { useSetAtom } from 'jotai'

import { showHarvestTooltipAtom } from 'states/system'
import { harvestTxAtom } from 'states/tx'
import { StakingEthereumAbi } from 'config/abi'
import { ToastType } from 'config/constants'
import { useChain } from './useChain'
import { useSwitchNetwork } from './useSwitchNetwork'
import { useToast } from './useToast'
import { isEthereum } from 'utils/isEthereum'

export function useHarvest() {
  const { chainId, stakingAddress } = useChain()
  const { switchBeforeSend } = useSwitchNetwork()
  const toast = useToast()

  const setTx = useSetAtom(harvestTxAtom)
  const setShowHarvestTooltip = useSetAtom(showHarvestTooltipAtom)

  const { config: writeConfig } = usePrepareContractWrite({
    address: stakingAddress,
    abi: StakingEthereumAbi,
    chainId,
    functionName: 'earmarkRewards',
    onError: switchBeforeSend,
    enabled: isEthereum(chainId),
  })

  const { writeAsync } = useContractWrite(writeConfig)

  const harvest = useCallback(async () => {
    try {
      const res = await writeAsync?.()
      setShowHarvestTooltip(false)
      if (!res?.hash) return

      const props = {
        hash: res.hash,
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
  }, [setShowHarvestTooltip, setTx, toast, writeAsync])

  return writeAsync ? harvest : null
}
