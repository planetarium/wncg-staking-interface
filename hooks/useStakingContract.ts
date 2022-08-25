import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { Contract } from 'ethers'

import { getAccount } from 'app/states/connection'
import { networkMismatchState } from 'app/states/network'
import { stakingAbi } from 'lib/abis'
import { useProvider } from './useProvider'
import { useAppSelector } from './useRedux'

export function useStakingContract() {
  const provider = useProvider()

  const networkMismatch = useRecoilValue(networkMismatchState)
  const account = useAppSelector(getAccount)

  const contract = useMemo(() => {
    if (!provider || networkMismatch || !account) {
      return null
    }

    return new Contract(
      process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS as string,
      stakingAbi,
      provider.getSigner(account)
    )
  }, [account, networkMismatch, provider])

  return contract
}
