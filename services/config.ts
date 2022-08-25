import { Network } from '@balancer-labs/sdk'

import { networkId } from 'app/states/network'
import config from 'config'

interface Env {
  domain: string
  env: string
  network: Network
  poolId: string
  stakingAddress: string
}

export class ConfigService {
  public get env(): Env {
    return {
      env: process.env.NODE_ENV || 'development',
      network: networkId,
      domain: process.env.NEXT_PUBLIC_DOMAIN || 'stake.nine-chronicles.com',
      poolId:
        process.env.NEXT_PUBLIC_BALANCER_POOL_ID ||
        '0xe8cc7e765647625b95f59c15848379d10b9ab4af0002000000000000000001de',
      stakingAddress:
        process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS ||
        '0xCC2db561d149A6d2F071A2809492d72E07838F69',
    }
  }

  public getNetworkConfig(key: Network) {
    if (!Object.keys(config).includes(key?.toString())) {
      throw new Error(`No config for network key: ${key}`)
    }
    return config[key]
  }

  public get network() {
    return config[this.env.network]
  }

  public get subgraph() {
    return config[this.env.network].subgraph
  }

  public get vaultAddress() {
    return config[this.env.network].addresses.vault
  }

  public get weth() {
    return config[this.env.network].addresses.weth
  }
}

export const configService = new ConfigService()
