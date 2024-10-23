import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import { wallets } from 'lib/rainbowkit/wallets'

export const connectors = connectorsForWallets([
  {
    groupName: 'Wallets',
    wallets,
  },
])
