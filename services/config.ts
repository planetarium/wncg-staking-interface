import { Network } from '@balancer-labs/sdk'

import config from 'config'

interface Env {
  coingecko: {
    baseUrl: string
  }
  docs: {
    notion: string
    terms: string
    privacy: string
  }
  domain: string
  env: string
  github: {
    auditReportUrl: string
    repositoryName: string
    repositoryUrl: string
  }
  legacyStakingAddress: string
  network: Network
  ogImageUrl: string
  poolId: string
  siteUrl: string
  socialMedia: {
    discord: string
    medium: string
    twitter: string
  }
  stakingAddress: string
  rewardTokensList: string[]
  version: string
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
      coingecko: {
        baseUrl:
          process.env.NEXT_PUBLIC_COINGECKO_API_BASE_UR ||
          'https://api.coingecko.com/api/v3',
      },
      docs: {
        notion:
          process.env.NEXT_PUBLIC_DOCUMENTATION_URL ||
          'https://planetarium.notion.site/WNCG-Staking-Docs-04317420d2d647ee82f2f1364358c5a9',
        terms:
          process.env.NEXT_PUBLIC_TERMS_OF_SERVICE_URL ||
          'https://stake.nine-chronicles.com/wncg/terms',
        privacy:
          process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL ||
          'https://stake.nine-chronicles.com/wncg/privacy',
      },
      domain: process.env.NEXT_PUBLIC_DOMAIN || 'stake.nine-chronicles.com',
      env: process.env.NODE_ENV || 'development',
      github: {
        auditReportUrl:
          process.env.NEXT_PUBLIC_AUDIT_REPORT_URL ||
          'https://github.com/planetarium/wncg-staking/blob/main/contracts/audits/%5BTheori%5D%20Planetarium%20WNCG%20Staking%20Protocol%20Security%20Audit%20Final%20Report.pdf',
        repositoryName:
          process.env.NEXT_PUBLIC_GITHUB_REPO || 'planetarium/wncg-staking',
        repositoryUrl:
          process.env.NEXT_PUBLIC_GITHUB_REPO_URL ||
          'https://github.com/planetarium/wncg-staking',
      },
      legacyStakingAddress:
        process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS_LEGACY ||
        '0xCC2db561d149A6d2F071A2809492d72E07838F69',
      network:
        process.env.NEXT_PUBLIC_NETWORK_ID != null
          ? (Number(process.env.NEXT_PUBLIC_NETWORK_ID) as Network)
          : Network.MAINNET,
      ogImageUrl:
        process.env.NEXT_PUBLIC_OG_IMAGE_URL ||
        'https://wncg-staking-resources.s3.us-east-2.amazonaws.com',
      poolId:
        process.env.NEXT_PUBLIC_BALANCER_POOL_ID ||
        '0xe8cc7e765647625b95f59c15848379d10b9ab4af0002000000000000000001de',
      siteUrl:
        process.env.NEXT_PUBLIC_SITE_URL || 'https://stake.nine-chronicles.com',
      socialMedia: {
        discord:
          process.env.NEXT_PUBLIC_DISCORD || 'https://discord.gg/planetarium',
        medium:
          process.env.NEXT_PUBLIC_MEDIUM || 'https://ninechronicles.medium.com',
        twitter:
          process.env.NEXT_PUBLIC_TWITTER ||
          'https://twitter.com/NineChronicles',
      },
      stakingAddress:
        process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS ||
        '0xc53b567A70dB04E928FB96D6A417971aa88fdA38',
      rewardTokensList: process.env.NEXT_PUBLIC_REWARD_TOKENS_LIST?.split(
        ','
      ) || [
        '0xf203ca1769ca8e9e8fe1da9d147db68b6c919817',
        '0xba100000625a3754423978a60c9317c58a424e3d',
      ],
      version: process.env.NEXT_PUBLIC_VERSION || 'v2.0.0',
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

  get coingecko() {
    return this.env.coingecko
  }

  get docs() {
    return this.env.docs
  }

  get github() {
    return this.env.github
  }

  get legacyStakingAddress() {
    return this.env.legacyStakingAddress.toLowerCase()
  }

  get networkId() {
    return this.env.network
  }

  get ogImageUrl() {
    return this.env.ogImageUrl
  }

  get poolId() {
    return this.env.poolId
  }

  get siteUrl() {
    return this.env.siteUrl
  }

  get socialMedia() {
    return this.env.socialMedia
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
