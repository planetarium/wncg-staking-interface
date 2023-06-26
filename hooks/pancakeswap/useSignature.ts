import { useCallback, useMemo } from 'react'
import { useMount } from 'react-use'
import { useAtom } from 'jotai'
import { splitSignature } from '@ethersproject/bytes'
import { useContract } from 'wagmi'
import { signTypedData } from '@wagmi/core'

import { currentTimestampAtom } from 'states/system'
import { PancakePairAbi } from 'config/abi'
import { DEX_PROTOCOL_ADDRESS } from 'config/constants/addresses'
import { SECOND } from 'config/misc'
import { provider } from 'lib/wagmi/chains'
import { now } from 'utils/now'
import { parseUnits } from 'utils/parseUnits'
import { useAuth, useChain, useStaking } from 'hooks'

const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
]

const Permit = [
  { name: 'owner', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'deadline', type: 'uint256' },
]

const types = {
  EIP712Domain,
  Permit,
}

export function useSignature() {
  const { account } = useAuth()
  const { chainId } = useChain()
  const { lpToken } = useStaking()

  const [currentTimestamp, setCurrentTimestamp] = useAtom(currentTimestampAtom)

  const deadline = currentTimestamp + SECOND * 60 * 1

  const lpTokenContract = useContract({
    address: lpToken.address,
    abi: PancakePairAbi,
    signerOrProvider: provider({ chainId }),
  })

  const domain = useMemo(
    () => ({
      name: `Pancake LPs`,
      version: '1',
      chainId,
      verifyingContract: lpToken.address,
    }),
    [chainId, lpToken.address]
  )

  const sign = useCallback(
    async (lpAmountOut: string) => {
      if (!lpTokenContract) return

      const nonce = await lpTokenContract.nonces(account)

      const scaledLpAmountOut = parseUnits(
        lpAmountOut,
        lpToken.decimals
      ).toString()

      const message = {
        owner: account!,
        spender: DEX_PROTOCOL_ADDRESS[chainId],
        value: scaledLpAmountOut,
        nonce: nonce.toHexString(),
        deadline,
      }

      const rawSig = await signTypedData({
        domain,
        types,
        value: message,
      })

      const signature = splitSignature(rawSig)

      return {
        deadline,
        v: signature.v,
        r: signature.r,
        s: signature.s,
      }
    },
    [lpTokenContract, account, lpToken.decimals, chainId, deadline, domain]
  )

  useMount(() => {
    setCurrentTimestamp(now())
  })

  return sign
}
