import { atom } from 'jotai'

import { configService } from 'services/config'
import { legacyModeAtom } from './userSettings'

export const totalStakedAtom = atom('0')

// NOTE: Read-only Derived Atom
export const stakingContractAddressAtom = atom((get) =>
  get(legacyModeAtom)
    ? configService.legacyStakingAddress
    : configService.stakingAddress
)
