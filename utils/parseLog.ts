import type { Log } from '@ethersproject/abstract-provider'

import {
  ercTokenIface,
  liquidityGaugeIface,
  stakingIface,
  vaultIface,
  wethIface,
} from 'lib/interface'

export function parseLog(log: Log) {
  try {
    return ercTokenIface.parseLog(log)
  } catch {
    try {
      return stakingIface.parseLog(log)
    } catch {
      try {
        return liquidityGaugeIface.parseLog(log)
      } catch {
        try {
          return vaultIface.parseLog(log)
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
