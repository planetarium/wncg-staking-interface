import { useCallback } from 'react'
import { useSetRecoilState } from 'recoil'
import type { BigNumber } from 'ethers'

import { approvalState, ApprovalTokenSymbol } from 'app/states/approval'
import { getAccount } from 'app/states/connection'
import { stakingContractAddress, vaultContractAddress } from 'utils/env'
import { handleError } from 'utils/error'
import { useContracts } from './useContracts'
import { useAppSelector } from './useRedux'

export function useAllowance() {
  const { bptContract, wethContract, wncgContract } = useContracts()

  const setApproval = useSetRecoilState(approvalState)
  const account = useAppSelector(getAccount)

  const updateApprovalStatus = useCallback(
    (tokenName: ApprovalTokenSymbol, amount: BigNumber) => {
      if (!amount || amount.isZero()) {
        setApproval((prev) => ({ ...prev, [tokenName]: false }))
        return
      }
      setApproval((prev) => ({ ...prev, [tokenName]: true }))
    },
    [setApproval]
  )

  const bptAllowanceToStakingContract = useCallback(async () => {
    try {
      const approvedAmount = await bptContract?.allowance(
        account,
        stakingContractAddress
      )
      updateApprovalStatus('bpt', approvedAmount)
    } catch (error) {
      handleError(error)
    }
  }, [account, bptContract, updateApprovalStatus])

  const wethAllowanceToVaultContract = useCallback(async () => {
    try {
      const approvedAmount = await wethContract?.allowance(
        account,
        vaultContractAddress
      )
      updateApprovalStatus('weth', approvedAmount)
    } catch (error) {
      handleError(error)
    }
  }, [account, updateApprovalStatus, wethContract])

  const wncgAllowanceToVaultContract = useCallback(async () => {
    try {
      const approvedAmount = await wncgContract?.allowance(
        account,
        vaultContractAddress
      )
      updateApprovalStatus('wncg', approvedAmount)
    } catch (error) {
      handleError(error)
    }
  }, [account, updateApprovalStatus, wncgContract])

  return {
    bptAllowanceToStakingContract,
    wethAllowanceToVaultContract,
    wncgAllowanceToVaultContract,
  }
}
