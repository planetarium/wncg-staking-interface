import { useAtomValue } from 'jotai'

import { addLiquidityErrorAtom } from './useWatch'

import FailPage from 'components/Modals/shared/FailPage'

export default function AddLiquidityModalPage3() {
  const error = useAtomValue(addLiquidityErrorAtom)
  console.log(error.message)

  return <FailPage action="Join pool" reason={error?.message} />
}
