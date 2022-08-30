import type { Web3Provider, JsonRpcSigner } from '@ethersproject/providers'
import { Contract } from 'ethers'

import { Erc20Abi } from 'lib/abi'

export async function aggregateCall<T>(
  signerOrProvider: Web3Provider | JsonRpcSigner,
  addresses: string[],
  method: string,
  ...args: any[]
): Promise<T[]> {
  const contracts = addresses.map(
    (address) => new Contract(address, Erc20Abi, signerOrProvider)
  )

  const requests: Promise<T>[] = contracts.map((contract) =>
    contract[method](...args)
  )

  return Promise.all(requests)
}
