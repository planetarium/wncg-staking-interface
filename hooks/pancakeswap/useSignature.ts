import { useCallback, useMemo } from 'react'
import { getContract } from 'viem'
import { getPublicClient, signTypedData } from '@wagmi/core'
import { useAtom } from 'jotai'
import { splitSignature } from '@ethersproject/bytes'

import { currentTimestampAtom } from 'states/system'
import { PancakePairAbi } from 'config/abi'
import { SECOND } from 'config/misc'
import { now } from 'utils/now'
import { parseUnits } from 'utils/parseUnits'
import { useAuth, useChain, useClientMount, useStaking } from 'hooks'

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

export function useSignature() {
  const { account } = useAuth()
  const { chainId, dexProtocolAddress } = useChain()
  const { lpToken } = useStaking()

  const [currentTimestamp, setCurrentTimestamp] = useAtom(currentTimestampAtom)

  const deadline = currentTimestamp + SECOND * (60 + 10) * 1

  const publicClient = getPublicClient({ chainId })

  const lpTokenContract = useMemo(
    () =>
      getContract({
        address: lpToken?.address,
        abi: PancakePairAbi,
        publicClient,
      }),
    [lpToken?.address, publicClient]
  )

  const domain = useMemo(
    () => ({
      name: 'Pancake LPs',
      version: '1',
      chainId,
      verifyingContract: lpToken?.address,
    }),
    [chainId, lpToken?.address]
  )

  const sign = useCallback(
    async (lpAmountOut: string) => {
      if (!lpTokenContract) return

      const nonce = await lpTokenContract.read.nonces([account])

      const scaledLpAmountOut = parseUnits(
        lpAmountOut,
        lpToken?.decimals
      ).toString()

      const message = {
        owner: account!,
        spender: dexProtocolAddress,
        value: scaledLpAmountOut,
        nonce,
        deadline,
      }

      const params = {
        domain,
        primaryType: 'Permit',
        types: {
          EIP712Domain,
          Permit,
        },
        message,
      }

      // @ts-ignore
      const rawSig = await signTypedData(params)
      const signature = splitSignature(rawSig)

      return {
        deadline,
        v: signature.v,
        r: signature.r,
        s: signature.s,
      }
    },
    [
      lpTokenContract,
      account,
      lpToken?.decimals,
      dexProtocolAddress,
      deadline,
      domain,
    ]
  )

  useClientMount(() => {
    setCurrentTimestamp(now())
  })

  return sign
}
