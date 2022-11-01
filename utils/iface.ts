import type { Log } from '@ethersproject/abstract-provider'

import {
  ercTokenIface,
  liquidityGaugeIface,
  stakingIface,
  vaultIface,
} from 'lib/interface'

export function parseLog(log: Log) {
  try {
    return ercTokenIface.parseLog(log)
  } catch {
    try {
      return liquidityGaugeIface.parseLog(log)
    } catch {
      try {
        return stakingIface.parseLog(log)
      } catch {
        try {
          return vaultIface.parseLog(log)
        } catch {
          return null
        }
      }
    }
  }
}

export function parseTransaction(log: Log) {
  try {
    return ercTokenIface.parseTransaction(log)
  } catch {
    try {
      return liquidityGaugeIface.parseTransaction(log)
    } catch {
      try {
        return stakingIface.parseTransaction(log)
      } catch {
        try {
          return vaultIface.parseTransaction(log)
        } catch {
          return null
        }
      }
    }
  }
}
