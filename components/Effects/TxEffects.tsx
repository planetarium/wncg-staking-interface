import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'

import { pendingTxListState } from 'app/states/transaction'
import { useTx } from 'hooks'

function TxEffects() {
  const { pingPendingTx } = useTx()
  const pendingTxList = useRecoilValue(pendingTxListState)

  useEffect(() => {
    if (!pingPendingTx) return
    pendingTxList.forEach((tx) => pingPendingTx(tx.transaction))
  }, [pingPendingTx, pendingTxList])

  return null
}

export default TxEffects
