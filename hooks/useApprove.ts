import { useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import { Contract } from 'ethers'

import { accountState } from 'app/states/connection'
import { approve as initApprove } from 'contracts/erc20'
import { TxAction } from 'services/transaction'
import { Erc20Abi } from 'lib/abi'
import { getTokenSymbol } from 'utils/token'
import { useProvider } from './useProvider'
import { useTx } from './useTx'

export function useApprove() {
  const provider = useProvider()
  const { registerTx } = useTx()

  const account = useRecoilValue(accountState)

  const approve = useCallback(
    async (address: string, spender: string) => {
      if (!address || !provider || !account) return

      const contract = new Contract(
        address,
        Erc20Abi,
        provider.getSigner(account)
      )

      const response = await initApprove(contract, spender)
      registerTx?.(response, TxAction.Approve, getTokenSymbol(address))
      return response.hash
    },
    [account, provider, registerTx]
  )

  return {
    approve,
  }
}
