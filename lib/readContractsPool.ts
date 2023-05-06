import {
  readContracts,
  ReadContractsConfig,
  ReadContractsResult,
} from '@wagmi/core'
import { Abi } from 'abitype'
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

    const data = await readContracts({
      contracts,
      allowFailure: true,
    })

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
