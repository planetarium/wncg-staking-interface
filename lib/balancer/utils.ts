import { isSameAddress } from '@balancer/sdk'

import {
  NATIVE_CURRENCY_ADDRESS,
  ZERO_ADDRESS,
} from 'config/constants/addresses'

export function formatAddressForSor(address: Hash): Hash {
  return isSameAddress(address, NATIVE_CURRENCY_ADDRESS)
    ? ZERO_ADDRESS
    : address
}
