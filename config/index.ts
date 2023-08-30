import { ChainId, defaultChainId } from './chains'

class ConfigService {
  get assetPlatform() {
    return process.env.NEXT_PUBLIC_ASSET_PLATFORM ?? 'ethereum'
  }

  get appName() {
    return `Nine Chronicles Staking`
  }

  get appDescription() {
    return `Stake Balancer & PancakeSwap LP token and earn rewards!`
  }

  get baseUrl() {
    return process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  }

  get domain() {
    return 'stake.nine-chronicles.com'
  }

  get docs() {
    return {
      notion:
        'https://planetarium.notion.site/WNCG-Staking-Docs-04317420d2d647ee82f2f1364358c5a9',
      terms: 'https://stake.nine-chronicles.com/docs/terms',
      privacy: 'https://stake.nine-chronicles.com/docs/privacy',
      auditReport:
        'https://github.com/planetarium/staking_contract_wncg_eth/blob/main/audit/%5BTheori%5D%20Planetarium%20WNCG%20Staking%20Protocol%20Security%20Audit%20Final%20Report.pdf',
    }
  }

  get env() {
    return process.env.NODE_ENV ?? 'development'
  }

  get googleTagManager() {
    return process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER ?? ''
  }

  get isTestnet() {
    return (
      defaultChainId === ChainId.GOERLI ||
      defaultChainId === ChainId.BSC_TESTNET
    )
  }

  get links() {
    return {
      discord: 'https://discord.gg/planetarium',
      medium:
        'https://ninechronicles.medium.com/introducing-wncg-staking-ft-chapter-iii-a27f26d70522',
      twitter: 'https://twitter.com/NineChronicles',
    }
  }

  get stakingAppName() {
    return `WNCG Staking`
  }

  get stakingLinks() {
    return {
      medium:
        'https://medium.com/@ninechronicles/introducing-wncg-staking-ft-chapter-iii-a27f26d70522',
      github: 'https://github.com/planetarium/staking_contract_wncg_eth',
    }
  }

  get siteUrl() {
    return 'https://stake.nine-chronicles.com'
  }

  get walletConnectProjectId() {
    return process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
  }
}

const config = new ConfigService()

export default config
