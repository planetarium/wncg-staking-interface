import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'

import { pendingTxListState } from 'app/states/transaction'
import { useTx } from 'hooks'

function TxEffects() {
  const { resolvePendingTx } = useTx()
  const pendingTxList = useRecoilValue(pendingTxListState)

  useEffect(() => {
    if (!resolvePendingTx) return
    pendingTxList.forEach((tx) => resolvePendingTx(tx.hash))
  }, [resolvePendingTx, pendingTxList])

  return null
}

export default TxEffects
