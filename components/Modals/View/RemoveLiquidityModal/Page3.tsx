import { useAtomValue } from 'jotai'

import { removeLiquidityErrorAtom } from './useWatch'

import FailPage from 'components/Modals/shared/FailPage'

export default function RemoveLiquidityModalPage3() {
  const error = useAtomValue(removeLiquidityErrorAtom)
  // console.log(error.message)

  return (
    <FailPage
      action="Exit pool"
      reason="Exit pool transaction failed. Please try again."
    />
  )
}
