import config from 'config'
import { Network } from 'config/constants'

export function poolUrlFor() {
  let networkName = 'app'
  if (config.chainId === Network.GOERLI) networkName = 'goerli'

  return `https://${networkName}.balancer.fi/${config.poolId}`
}
