import { useMemo } from 'react'
import { useAtomValue } from 'jotai'

import { stakingErrorAtom } from './useWatch'

import FailPage from 'components/Modals/shared/FailPage'

export default function StakeModalPage3() {
  const error = useAtomValue(stakingErrorAtom)

  const reason = useMemo(() => {
    switch (error?.message) {
      case 'INSUFFICIENT_ALLOWANCE':
        return 'Please approve the amount you want to stake'

      default:
        return 'Staking transaction failed. Please try again.'
    }
  }, [error?.message])

  return <FailPage action="staking" reason={reason} />
}
