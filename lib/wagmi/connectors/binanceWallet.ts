/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import {
  Chain,
  ConnectorNotFoundError,
  SwitchChainNotSupportedError,
} from '@wagmi/core'
import { WindowProvider } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { hexValue } from '@ethersproject/bytes'
import {
  ResourceUnavailableRpcError,
  RpcError,
  UserRejectedRequestError,
} from 'viem'

declare global {
  interface Window {
    BinanceChain?: {
      bnbSign?: (
        address: Hash,
        message: string
      ) => Promise<{ publicKey: string; signature: string }>
      switchNetwork?: (networkId: string) => Promise<string>
    } & WindowProvider
  }
}

const mappingNetwork: Record<number, string> = {
  1: 'eth-mainnet',
  5: 'goerli-testnet',
  56: 'bsc-mainnet',
  97: 'bsc-testnet',
}

const _binanceChainListener = async () =>
  new Promise<void>((resolve) =>
    Object.defineProperty(window, 'BinanceChain', {
      get() {
        return this.bsc
      },

      set(bsc) {
        this.bsc = bsc
        resolve()
      },
    })
  )

export class BinanceWalletConnector extends InjectedConnector {
  readonly id = 'bsc'

  readonly ready = typeof window !== 'undefined'

  provider?: BinanceChain

  constructor({
    chains: _chains,
  }: {
    chains?: Chain[]
  } = {}) {
    const options = {
      name: 'Binance',
      shimDisconnect: false,
      shimChainChangedDisconnect: true,
    }
    const chains = _chains?.filter((c) => !!mappingNetwork[c.id])
    super({
      chains,
      options,
    })
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()

      if (provider.on) {
        provider.on('accountsChanged', this.onAccountsChanged)
        provider.on('chainChanged', this.onChainChanged)
        provider.on('disconnect', this.onDisconnect)
      }

      this.emit('message', { type: 'connecting' })

      const account = await this.getAccount()
      // NOTE: Switch to chain if provided
      let id = await this.getChainId()
      let unsupported = this.isChainUnsupported(id)
      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId)
        id = chain.id
        unsupported = this.isChainUnsupported(id)
      }

      return { account, chain: { id, unsupported }, provider }
    } catch (error: any) {
      if (this.isUserRejectedRequestError(error))
        throw new UserRejectedRequestError(error)
      if ((<RpcError>error).code === -32002)
        throw new ResourceUnavailableRpcError(error)
      throw error
    }
  }

  async getProvider() {
    if (typeof window !== 'undefined') {
      // TODO: Fallback to `ethereum#initialized` event for async injection
      // https://github.com/MetaMask/detect-provider#synchronous-and-asynchronous-injection=
      if (window.BinanceChain) {
        this.provider = window.BinanceChain
      } else {
        await _binanceChainListener()
        this.provider = window.BinanceChain
      }
    }
    return this.provider
  }

  async switchChain(chainId: number): Promise<Chain> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()

    const id = hexValue(chainId)

    if (mappingNetwork[chainId]) {
      try {
        await provider.switchNetwork?.(mappingNetwork[chainId])

        return (
          this.chains.find((x) => x.id === chainId) || {
            id: chainId,
            name: `Chain ${id}`,
            network: `${id}`,
            nativeCurrency: {
              decimals: 18,
              name: 'BNB',
              symbol: 'BNB',
            },
            rpcUrls: {
              default: { http: [''] },
              public: {
                http: [''],
              },
            },
          }
        )
      } catch (error: any) {
        if ((error as any).error === 'user rejected') {
          throw new UserRejectedRequestError(error)
        }
      }
    }

    throw new SwitchChainNotSupportedError({ connector: this })
  }
}
