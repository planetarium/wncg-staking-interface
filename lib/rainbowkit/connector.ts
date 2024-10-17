import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import config from 'config'
import { chains } from 'lib/wagmi/chains'

export const { connectors } = getDefaultWallets({
  appName: config.appName,
  projectId: config.walletConnectProjectId ?? '#',
  chains,
})
