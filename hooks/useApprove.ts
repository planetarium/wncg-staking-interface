import { useCallback } from 'react'
import { useSetRecoilState } from 'recoil'
import { constants, Event } from 'ethers'

import { approvalState, ApprovalTokenSymbol } from 'app/states/approval'
import { addTx, removeTx, TransactionAction } from 'app/states/transaction'
import { stakingContractAddress, vaultContractAddress } from 'utils/env'
import { handleError } from 'utils/error'
import { useConfirmations } from './useConfirmations'
import { useContracts } from './useContracts'
import { useAppDispatch } from './useRedux'
import { useToast } from './useToast'
import { useTransaction } from './useTransaction'

export function useApprove() {
  const { getConfirmations, setConfirmations } = useConfirmations()
  const { addToast } = useToast()
  const { getTransactionReceipt } = useTransaction()

  const setApproval = useSetRecoilState(approvalState)
  const dispatch = useAppDispatch()

  const { bptContract, wethContract, wncgContract } = useContracts()

  const postApproveTransaction = useCallback(
    (tokenName: ApprovalTokenSymbol, data?: any) => {
      if (!data) return

      const symbol = getTokenSymbolName(tokenName)
      const tx = {
        hash: data.hash,
        action: TransactionAction.Approve,
        summary: `Approving ${symbol}`,
      }

      dispatch(addTx(tx))
      addToast(tx, data.hash)
    },
    [addToast, dispatch]
  )

  const approveBpt = useCallback(async () => {
    try {
      const data = await bptContract?.approve(
        stakingContractAddress,
        constants.MaxUint256
      )
      postApproveTransaction('bpt', data)
    } catch (error) {
      handleError(error)
    }
  }, [postApproveTransaction, bptContract])

  const approveWeth = useCallback(async () => {
    try {
      const data = await wethContract?.approve(
        vaultContractAddress,
        constants.MaxUint256
      )
      postApproveTransaction('weth', data)
    } catch (error) {
      handleError(error)
    }
  }, [postApproveTransaction, wethContract])

  const approveWncg = useCallback(async () => {
    try {
      const data = await wncgContract?.approve(
        vaultContractAddress,
        constants.MaxUint256
      )
      postApproveTransaction('wncg', data)
    } catch (error) {
      handleError(error)
    }
  }, [postApproveTransaction, wncgContract])

  const createApprovalEventHandler = useCallback(
    (tokenName: ApprovalTokenSymbol) => {
      const symbol = getTokenSymbolName(tokenName)
      return async function ({ transactionHash }: Event) {
        const receipt = await getTransactionReceipt(transactionHash)
        if (!receipt) return

        dispatch(removeTx(transactionHash))
        setApproval((prev) => ({ ...prev, [tokenName]: true }))

        const confirmations = getConfirmations(transactionHash)
        if (!confirmations) return
        if (confirmations !== 'fulfilled') {
          addToast({
            action: TransactionAction.Approve,
            hash: transactionHash,
            summary: `Successfully approved ${symbol}`,
            showPartyEmoji: true,
          })
        }
        setConfirmations(transactionHash)
      }
    },
    [
      addToast,
      dispatch,
      getConfirmations,
      getTransactionReceipt,
      setApproval,
      setConfirmations,
    ]
  )

  return {
    approveBpt,
    approveWeth,
    approveWncg,
    createApprovalEventHandler,
  }
}

function getTokenSymbolName(tokenName: ApprovalTokenSymbol) {
  return tokenName === 'bpt' ? '20WETH-80WNCG' : tokenName.toUpperCase()
}
