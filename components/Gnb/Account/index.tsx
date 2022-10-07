import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { AnimatePresence } from 'framer-motion'
import styles from './style.module.scss'

import { isMobileAtom } from 'states/ui'
import { useAccount } from 'hooks'

import { Jazzicon } from 'components/Jazzicon'
import { AccountPendingTx } from './PendingTx'
import { AccountUserMenu } from './UserMenu'

export function GnbAccount() {
  const [show, setShow] = useState(false)
  const { account } = useAccount()

  const isMobile = useAtomValue(isMobileAtom)
  const jazziconSize = isMobile ? 28 : 32

  if (!account) {
    return null
  }

  function open() {
    setShow(true)
  }

  function close() {
    setShow(false)
  }

  return (
    <div className={styles.gnbAccount}>
      {!isMobile && <AccountPendingTx />}

      <button
        className={styles.accountButton}
        type="button"
        onClick={open}
        aria-label="Open account menu"
      >
        <Jazzicon address={account} diameter={jazziconSize} />
      </button>

      <AnimatePresence>
        {show && <AccountUserMenu close={close} />}
      </AnimatePresence>
    </div>
  )
}
