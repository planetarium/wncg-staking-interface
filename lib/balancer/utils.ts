import { isSameAddress } from '@balancer-labs/sdk'

import {
  NATIVE_CURRENCY_ADDRESS,
  ZERO_ADDRESS,
} from 'config/constants/addresses'

export function formatAddressForSor(address: string): string {
  return isSameAddress(address, NATIVE_CURRENCY_ADDRESS)
    ? ZERO_ADDRESS
    : address
}
