import { useState } from 'react'
import { useMount } from 'react-use'
import { useSetRecoilState } from 'recoil'
import { AnimatePresence } from 'framer-motion'
import styles from './style.module.scss'

import { txMapState } from 'app/states/transaction'
import { useTx } from 'hooks'

import { PendingTxButton } from './TxButton'
import { PendingTxMenu } from './TxMenu'

export function AccountPendingTx() {
  const { txService } = useTx()

  const [show, setShow] = useState(false)
  const setTxMap = useSetRecoilState(txMapState)

  function open() {
    setShow(true)
  }

  function close() {
    setShow(false)
  }

  function getTxMap() {
    if (!txService) return
    setTxMap(txService.txMap)
  }

  useMount(getTxMap)

  return (
    <div className={styles.pendingTx}>
      <PendingTxButton open={open} />
      <AnimatePresence>
        {show && <PendingTxMenu close={close} />}
      </AnimatePresence>
    </div>
  )
}
