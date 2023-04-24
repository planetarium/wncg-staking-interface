import { Network } from 'config/constants'

import _goerli from './goerli.json'
import _homestead from './homestead.json'

const goerli = _goerli as NetworkConfig
const homestead = _homestead as NetworkConfig

const networks: Record<Network, NetworkConfig> = {
  [Network.MAINNET]: homestead,
  [Network.GOERLI]: goerli,
}

export default networks
