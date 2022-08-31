import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { AnimatePresence } from 'framer-motion'
import styles from './style.module.scss'

import { accountState } from 'app/states/connection'
import { isMobileState } from 'app/states/mediaQuery'

import { Jazzicon } from 'components/Jazzicon'
import { AccountPendingTx } from './PendingTx'
import { AccountSidebar } from './Sidebar'
import { AccountUserMenu } from './UserMenu'

export function GnbAccount() {
  const [show, setShow] = useState(false)

  const account = useRecoilValue(accountState)
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

  const accountMenu = isMobile ? (
    <AccountSidebar close={close} />
  ) : (
    <AccountUserMenu close={close} />
  )

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

      <AnimatePresence>{show && accountMenu}</AnimatePresence>
    </div>
  )
}
