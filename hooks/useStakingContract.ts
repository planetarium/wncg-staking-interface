import { useMemo } from 'react'
import { Contract } from 'ethers'

import { getAccount, getIsValidNetwork } from 'app/states/connection'
import { stakingAbi } from 'lib/abis'
import { useProvider } from './useProvider'
import { useAppSelector } from './useRedux'

export function useStakingContract() {
  const provider = useProvider()

  const account = useAppSelector(getAccount)
  const isValidNetwork = useAppSelector(getIsValidNetwork)

  const contract = useMemo(() => {
    if (!provider || !isValidNetwork || !account) {
      return null
    }

    return new Contract(
      process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS as string,
      stakingAbi,
      provider.getSigner(account)
    )
  }, [account, isValidNetwork, provider])

  return contract
}
