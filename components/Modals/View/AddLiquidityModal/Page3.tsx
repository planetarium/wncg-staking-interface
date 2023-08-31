import { useMemo } from 'react'
import { useAtomValue } from 'jotai'

import { addLiquidityErrorAtom } from './useWatch'

import FailPage from 'components/Modals/shared/FailPage'

export default function AddLiquidityModalPage3() {
  const error = useAtomValue(addLiquidityErrorAtom)

  const reason = useMemo(() => {
    switch (error?.message) {
      case 'INSUFFICIENT_ALLOWANCE':
        return 'Please approve the amount you want to join'
      case 'INSUFFICIENT_A_AMOUNT':
      case 'INSUFFICIENT_B_AMOUNT':
        return 'Failed to receive proper value. Please increase slippage or try again later'
      default:
        return undefined
    }
  }, [error?.message])

  return <FailPage action="Join pool" reason={reason} />
}
