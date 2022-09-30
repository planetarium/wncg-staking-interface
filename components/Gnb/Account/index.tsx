import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'
import styles from './style.module.scss'

import { isMobileState } from 'app/states/mediaQuery'

import { Jazzicon } from 'components/Jazzicon'
import { AccountPendingTx } from './PendingTx'
import { AccountUserMenu } from './UserMenu'

export function GnbAccount() {
  const [show, setShow] = useState(false)
  const { address: account } = useAccount()

  const isMobile = useRecoilValue(isMobileState)
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
