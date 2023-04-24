import { MouseEvent, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { AnimatePresence } from 'framer-motion'

import { useAuth, useResponsive } from 'hooks'

import { StyledGnb } from './styled'
import CryptoIcon from 'components/CryptoIcon'
import Suspense from 'components/Suspense'
import AccountMenu from './AccountMenu'
import ConnectButton from './ConnectButton'
import MenuButton from './MenuButton'
import MenuList from './MenuList'
import Sidebar from './Sidebar'

const ClaimableRewards = dynamic(() => import('./ClaimableRewards'), {
  ssr: false,
})

const MyStaking = dynamic(() => import('./MyStaking'), { ssr: false })

export default function MainGnb() {
  const [show, setShow] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  const { isConnected } = useAuth()

  const { isBrowser } = useResponsive()

  function openSidebar(e: MouseEvent) {
    e.stopPropagation()
    setShowSidebar(true)
  }

  function closeMenu() {
    setShow(false)
  }

  function closeSidebar() {
    setShowSidebar(false)
  }

  function toggle(e: MouseEvent) {
    e.stopPropagation()
    setShow((prev) => !prev)
  }

  const showStaking = !!isConnected && isBrowser

  return (
    <StyledGnb>
      <div className="left">
        <h1 className="logo">
          <Link href="/">
            <CryptoIcon icon="appLogo" />
          </Link>
        </h1>

        {showStaking && (
          <Suspense>
            <MyStaking />
          </Suspense>
        )}
      </div>

      {showStaking && (
        <Suspense>
          <ClaimableRewards />
        </Suspense>
      )}

      <div className="right">
        <MenuList />

        <div className="account">
          <ConnectButton toggle={toggle} />

          <AnimatePresence>
            {show && <AccountMenu closeMenu={closeMenu} />}
          </AnimatePresence>
        </div>

        <MenuButton open={openSidebar} />

        <AnimatePresence>
          {showSidebar && <Sidebar closeSidebar={closeSidebar} />}
        </AnimatePresence>
      </div>
    </StyledGnb>
  )
}