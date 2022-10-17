import { useEffect } from 'react'
import { useAtomValue } from 'jotai'

import { pendingTxListAtom } from 'states/tx'
import { useTx } from 'hooks'

function TxEffects() {
  const { pingPendingTx } = useTx()

  const pendingTxList = useAtomValue(pendingTxListAtom)

  useEffect(() => {
    if (!pingPendingTx) return
    pendingTxList.forEach((tx) => pingPendingTx(tx.transaction))
  }, [pingPendingTx, pendingTxList])

  return null
}

export default TxEffects
