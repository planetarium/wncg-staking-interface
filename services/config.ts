import { Network } from '@balancer-labs/sdk'

import { networkId } from 'app/states/network'
import config from 'config'

interface Env {
  domain: string
  env: string
  network: Network
  poolId: string
  stakingAddress: string
  rewardTokensList: string[]
  zeroAddress: string
}

export class ConfigService {
  getNetworkConfig(key: Network) {
    if (!Object.keys(config).includes(key?.toString())) {
      throw new Error(`No config for network key: ${key}`)
    }
    return config[key]
  }

  get env(): Env {
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
      rewardTokensList: process.env.NEXT_PUBLIC_REWARD_TOKENS_LIST?.split(
        ','
      ) || [
        '0xf203ca1769ca8e9e8fe1da9d147db68b6c919817',
        '0xba100000625a3754423978a60c9317c58a424e3d',
      ],
      zeroAddress: '0x0000000000000000000000000000000000000000',
    }
  }

  get network() {
    return config[this.env.network]
  }

  get nativeAsset() {
    return this.network.nativeAsset
  }

  get nativeAssetAddress() {
    return this.network.nativeAsset.address.toLowerCase()
  }

  get subgraph() {
    return this.network.subgraph
  }

  get vaultAddress() {
    return this.network.addresses.vault.toLowerCase()
  }

  get bal() {
    return this.network.addresses.bal.toLowerCase()
  }

  get weth() {
    return this.network.addresses.weth.toLowerCase()
  }

  get poolId() {
    return this.env.poolId
  }

  get stakingAddress() {
    return this.env.stakingAddress.toLowerCase()
  }

  get rewardTokensList() {
    return this.env.rewardTokensList
  }

  get zeroAddress() {
    return this.env.zeroAddress
  }
}

export const configService = new ConfigService()
