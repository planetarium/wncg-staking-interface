import { MouseEvent, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion'

import { useAuth, useChain, useResponsive } from 'hooks'

import { StyledGnb } from './styled'
import Image from 'components/Image'
import Suspense from 'components/Suspense'
import ChainSelect from './ChainSelect'
import MenuButton from './MenuButton'
import MenuList from './MenuList'
import Sidebar from './Sidebar'

const AccountMenu = dynamic(() => import('./AccountMenu'), {
  ssr: false,
})

const ConnectButton = dynamic(() => import('./ConnectButton'), {
  ssr: false,
})

const ClaimableRewards = dynamic(() => import('./ClaimableRewards'), {
  ssr: false,
})

const MyStaking = dynamic(() => import('./MyStaking'), {
  ssr: false,
})

export default function MainGnb() {
  const [show, setShow] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  const { isConnected } = useAuth()
  const { chainId } = useChain()
  const { bp, isBrowser } = useResponsive()
  const { reload } = useRouter()

  const logoSrc = useMemo(() => {
    const breakpoint =
      bp === 'smLaptop' ? 'laptop' : bp === null ? 'desktop' : bp
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
    reload()
  }

  const showStaking = !!isConnected && isBrowser

  return (
    <StyledGnb>
      <div className="left">
        <h1 className="logo">
          <Link href={`/wncg/${chainId}`} onClick={onLogoClick}>
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

        <div className="settings">
          <ChainSelect />

          <div className="account">
            <Suspense>
              <ConnectButton toggle={toggle} />
            </Suspense>

            <AnimatePresence>
              {show && <AccountMenu closeMenu={closeMenu} />}
            </AnimatePresence>
          </div>

          <MenuButton open={openSidebar} />
        </div>

        <AnimatePresence>
          {showSidebar && <Sidebar closeSidebar={closeSidebar} />}
        </AnimatePresence>
      </div>
    </StyledGnb>
  )
}
