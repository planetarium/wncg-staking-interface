import networks from 'config/networks'

class ConfigService {
  get assetPlatform() {
    return process.env.NEXT_PUBLIC_ASSET_PLATFORM ?? 'ethereum'
  }

  get appName() {
    return `WNCG Staking`
  }

  get bal() {
    return (this.network.addresses.bal?.toLowerCase() ?? '') as Hash
  }

  get baseUrl() {
    return process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  }

  get blockExplorerName() {
    return this.network.explorerName
  }

  get blockExplorerUrl() {
    return this.network.explorer
  }

  get chainId() {
    return (Number(process.env.NEXT_PUBLIC_CHAIN_ID) ?? 1) as Network
  }

  get dexPlatformName() {
    return 'Balancer'
  }

  get domain() {
    return 'stake.nine-chronicles.com'
  }

  get docs() {
    return {
      notion:
        'https://planetarium.notion.site/WNCG-Staking-Docs-04317420d2d647ee82f2f1364358c5a9',
      terms: 'https://stake.nine-chronicles.com/wncg/terms',
      privacy: 'https://stake.nine-chronicles.com/wncg/privacy',
      auditReport:
        'https://github.com/planetarium/wncg-staking/blob/main/contracts/audits/%5BTheori%5D%20Planetarium%20WNCG%20Staking%20Protocol%20Security%20Audit%20Final%20Report.pdf',
    }
  }

  get env() {
    return process.env.NODE_ENV ?? 'development'
  }

  get github() {
    const repositoryName =
      process.env.NEXT_PUBLIC_GITHUB_REPO ??
      'planetarium/wncg-staking-interface'

    return {
      repositoryName,
      repositoryUrl: `https://github.com/${repositoryName}`,
    }
  }

  get links() {
    return {
      discord: 'https://discord.gg/planetarium',
      medium: 'https://ninechronicles.medium.com',
      twitter: 'https://twitter.com/NineChronicles',
    }
  }

  get multicallContract() {
    return (
      process.env.NEXT_PUBLIC_MULTICALL_ADDRESS ??
      '0xcA11bde05977b3631167028862bE2a173976CA11'
    ) // Universal
      .toLowerCase() as Hash
  }

  get nativeCurrency() {
    return {
      ...this.network.nativeCurrency,
      address: this.network.nativeCurrency.address.toLowerCase() as Hash,
    }
  }

  get network() {
    return networks[this.chainId]
  }

  get poolId() {
    return (
      process.env.NEXT_PUBLIC_BALANCER_POOL_ID ||
      '0xe8cc7e765647625b95f59c15848379d10b9ab4af0002000000000000000001de'
    )
  }

  get siteUrl() {
    return 'https://stake.nine-chronicles.com'
  }

  get stakingAddress() {
    return (
      process.env.NEXT_PUBLIC_STAKING_ADDRESS ??
      '0xc53b567A70dB04E928FB96D6A417971aa88fdA38'
    ) // Mainnet
      .toLowerCase() as Hash
  }

  get subgraph() {
    return this.network.subgraph
  }

  get usdt() {
    return (this.network.addresses.usdt?.toLowerCase() ?? '') as Hash
  }

  get weth() {
    return (this.network.addresses.weth?.toLowerCase() ?? '') as Hash
  }

  get vault() {
    return (
      process.env.NEXT_PUBLIC_VAULT_ADDRESS ??
      '0xBA12222222228d8Ba445958a75a0704d566BF2C8'
    ).toLowerCase() as Hash
  }

  get version() {
    return process.env.NEXT_PUBLIC_VERSION ?? 'v2.0.0'
  }

  get zeroAddress(): Hash {
    return `0x0000000000000000000000000000000000000000`
  }
}

const config = new ConfigService()

export default config
