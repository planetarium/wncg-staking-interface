import { createPublicClient, http } from 'viem'
import { bsc, bscTestnet } from 'viem/chains'

import { PancakePairAbi } from 'config/abi'
import { ChainId } from 'config/chains'
import { STAKED_TOKEN_ADDRESS } from 'config/constants/addresses'
import { formatUnits } from 'utils/formatUnits'
import { resolveReadContractsResult } from 'utils/resolveReadContractsResult'

export async function fetchPancakeSwapPool(chainId: ChainId) {
  const stakedTokenAddress = STAKED_TOKEN_ADDRESS[chainId]
  const contracts = [
    {
      address: stakedTokenAddress,
      abi: PancakePairAbi as Abi,
      functionName: 'getReserves',
    },
    {
      address: stakedTokenAddress,
      abi: PancakePairAbi as Abi,
      functionName: 'totalSupply',
    },
  ]

  const publicClient = createPublicClient({
    chain: chainId === ChainId.BSC_TESTNET ? bscTestnet : bsc,
    transport: http(),
  })

  try {
    const _data = await publicClient.multicall({
      contracts,
      allowFailure: true,
    })

    const data = resolveReadContractsResult(_data) as [
      [BigInt, BigInt, BigInt],
      BigInt
    ]

    const [_reserves, _totalSupply] = data ?? []

    console.log(data)

    const reserves = [
      formatUnits(_reserves?.[0].toString() ?? '0', 18),
      formatUnits(_reserves?.[1].toString() ?? '0', 18),
    ]
    const totalSupply = formatUnits(_totalSupply?.toString() ?? '0', 18)

    console.log('>> fetchPancakeSwapPool', reserves, totalSupply)

    return {
      reserves,
      totalSupply,
    }
  } catch (error) {
    throw error
  }
}
