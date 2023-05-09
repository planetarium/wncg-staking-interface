import config from 'config'
import { Network } from 'config/constants'

export function poolUrlFor() {
  let networkName = 'ethereum'
  if (config.chainId === Network.GOERLI) networkName = 'goerli'

  return `https://app.balancer.fi/#/${networkName}/pool/${config.poolId}`
}
