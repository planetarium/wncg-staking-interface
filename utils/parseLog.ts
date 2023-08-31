import { Log } from 'viem'

import {
  balRewardPoolIface,
  ercTokenIface,
  liquidityGaugeIface,
  pancakePairIface,
  pancakeRouterIface,
  stakingBscIface,
  stakingEthereumIface,
  vaultIface,
  wethIface,
} from 'lib/interface'

export function parseLog(log: Log) {
  try {
    return ercTokenIface.parseLog(log)
  } catch {
    try {
      return stakingEthereumIface.parseLog(log)
    } catch {
      try {
        return stakingBscIface.parseLog(log)
      } catch {
        try {
          return pancakeRouterIface.parseLog(log)
        } catch {
          try {
            return pancakePairIface.parseLog(log)
          } catch {
            try {
              return liquidityGaugeIface.parseLog(log)
            } catch {
              try {
                return vaultIface.parseLog(log)
              } catch {
                try {
                  return balRewardPoolIface.parseLog(log)
                } catch {
                  try {
                    return wethIface.parseLog(log)
                  } catch {
                    return null
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
