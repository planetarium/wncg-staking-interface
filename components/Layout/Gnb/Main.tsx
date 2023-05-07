import { MouseEvent, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion'

import { useAuth, useResponsive } from 'hooks'

import { StyledGnb } from './styled'
import Image from 'components/Image'
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
  const { bp, isBrowser } = useResponsive()
  const { reload, pathname } = useRouter()

  const logoSrc = useMemo(() => {
    const breakpoint = bp === 'smLaptop' ? 'laptop' : bp
    return `/logo-staking-${breakpoint}.png`
  }, [bp])

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

  function onLogoClick() {
    if (pathname === '/wncg') reload()
  }

  const showStaking = !!isConnected && isBrowser

  return (
    <StyledGnb>
      <div className="left">
        <h1 className="logo">
          <Link href="/wncg" onClick={onLogoClick}>
            <Image src={logoSrc} alt="WNCG Staking" />
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
          {showSidebar && (
            <Suspense>
              <Sidebar closeSidebar={closeSidebar} />
            </Suspense>
          )}
        </AnimatePresence>
      </div>
    </StyledGnb>
  )
}
