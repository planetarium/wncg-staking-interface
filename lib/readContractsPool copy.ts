import {
  fetchSigner,
  getContract,
  getProvider,
  readContracts,
  ReadContractsConfig,
  ReadContractsResult,
} from '@wagmi/core'
import { Contract, providers } from 'ethers'
import { Abi } from 'abitype'
import config from 'config'
import { Multicall3Abi, StakingAbi } from 'config/abi'
import { nanoid } from 'nanoid'

class ReadContractsPool<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TContracts extends {
    abi: TAbi
    functionName: TFunctionName
  }[]
> {
  batchInterval = 3000
  pool: { [key in string]: ReadContractsConfig<TContracts> } = {}
  result: { [key in string]: ReadContractsResult<TContracts> } = {}
  currentChainId?: Network

  constructor() {
    setInterval(() => {
      this.batch()
    }, this.batchInterval)
  }

  private async batch() {
    const keys = Object.keys(this.pool)
    const contracts: any[] = []
    const aggregated: {
      [key in string]: { startIndex: number; length: number }
    } = {}

    for (const key of keys) {
      const config = this.pool[key]
      delete this.pool[key]
      if (!config) continue

      const startIndex = contracts.length
      const length = config.contracts.length

      contracts.push(...config.contracts)

      aggregated[key] = { startIndex, length }
    }

    const calls = this.buildCallData(contracts)
    const multicallContract = await this.multicall()

    const _data = await multicallContract?.aggregate3(...[calls])
    const data = this.parse(contracts, _data)

    for (const key of keys) {
      if (aggregated[key]) {
        const { startIndex, length } = aggregated[key]
        this.result[key] = data.slice(
          startIndex,
          startIndex + length
        ) as ReadContractsResult<TContracts>
      }
    }
  }

  private async multicall() {
    const provider = new providers.Web3Provider(
      window?.ethereum as any as providers.ExternalProvider,
      'any'
    )
    const signer = await fetchSigner({ chainId: config.chainId })

    const signerOrProvider =
      this.currentChainId !== config.chainId ? provider : signer ?? provider

    return new Contract(config.multicallContract, Multicall3Abi, provider)

    // return getContract({
    //   address: config.multicallContract,
    //   abi: Multicall3Abi,
    //   signerOrProvider,
    // })
  }

  private parse(contracts: any[], results: any[]) {
    return results.map(({ returnData, success }, i) => {
      const { address, abi, functionName } = contracts[i]
      const contract = new Contract(address, abi)

      if (!success) {
        return null
      }

      if (returnData === '0x') {
        return null
      }

      try {
        const result = contract.interface.decodeFunctionResult(
          functionName,
          returnData
        )
        return Array.isArray(result) && result.length === 1 ? result[0] : result
      } catch (err) {
        return null
      }
    })
  }

  private buildCallData(contracts: any[]) {
    return contracts.map(({ address, abi, functionName, args = [] }) => {
      const contract = new Contract(address, abi)

      try {
        const callData = contract.interface.encodeFunctionData(
          functionName,
          args
        )

        return {
          target: address,
          allowFailure: true,
          callData,
        }
      } catch (err) {
        return {
          target: address,
          allowFailure: false,
          callData: '0x',
        }
      }
    })
  }

  private addPool(key: string, config: ReadContractsConfig<TContracts>) {
    this.pool[key] = config
  }

  private wait(key: string): Promise<ReadContractsResult<TContracts>> {
    return new Promise((resolve, reject) => {
      let waitCount = 0

      const checkResult = () => {
        waitCount += 1

        if (waitCount > 1000) throw new Error('exceed limit')

        try {
          if (this.result[key]) {
            const result = this.result[key]
            delete this.result[key]
            resolve(result)
          } else {
            setTimeout(() => {
              checkResult()
            }, 300)
          }
        } catch (e) {
          reject(e)
        }
      }
      checkResult()
    })
  }

  public call(
    config: ReadContractsConfig<TContracts>,
    currentChainId?: Network
  ): Promise<ReadContractsResult<TContracts>> {
    this.currentChainId = currentChainId
    const key = nanoid()
    this.addPool(key, config)
    return this.wait(key)
  }
}

export const readContractsPool = new ReadContractsPool()
