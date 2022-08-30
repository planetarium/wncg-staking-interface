import { useCallback } from 'react'
import { Contract } from 'ethers'

import { getAccount } from 'app/states/connection'
import { approve as initApprove } from 'contracts/erc20'
import { TransactionAction } from 'services/transaction'
import { Erc20Abi } from 'lib/abi'
import { useProvider } from './useProvider'
import { useAppSelector } from './useRedux'
import { useTransaction } from './useTransaction'

export function useApprove() {
  const provider = useProvider()
  const { transactionService } = useTransaction()

  const account = useAppSelector(getAccount)

  const approve = useCallback(
    async (address: string, spender: string) => {
      if (!address || !provider || !account) return

      const contract = new Contract(
        address,
        Erc20Abi,
        provider.getSigner(account)
      )

      const response = await initApprove(contract, spender)
      transactionService?.registerTx(response, TransactionAction.Approve)
    },
    [account, provider, transactionService]
  )

  return {
    approve,
  }
}
