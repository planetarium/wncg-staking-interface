import { useState } from 'react'
import { useMount } from 'react-use'
import { useSetAtom } from 'jotai'
import { AnimatePresence } from 'framer-motion'
import styles from './style.module.scss'

import { txListAtom } from 'states/tx'
import { useTx } from 'hooks'

import { PendingTxButton } from './TxButton'
import { PendingTxMenu } from './TxMenu'

export function AccountPendingTx() {
  const [show, setShow] = useState(false)

  const { txService } = useTx()

  const setTxList = useSetAtom(txListAtom)

  function open() {
    setShow(true)
  }

  function close() {
    setShow(false)
  }

  function getTxList() {
    if (!txService) return
    setTxList(txService.txList)
  }

  useMount(getTxList)

  return (
    <div className={styles.pendingTx}>
      <PendingTxButton open={open} />
      <AnimatePresence>
        {show && <PendingTxMenu close={close} />}
      </AnimatePresence>
    </div>
  )
}
