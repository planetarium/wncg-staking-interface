import { MouseEvent, useState } from 'react'
import { AnimatePresence } from 'framer-motion'

import { ChainId } from 'config/chains'

import { StyledGnbChainSelect } from './styled'
import Menu from './Menu'
import Toggle from './Toggle'

const SUPPORTED_CHAINS = [
  // ChainId.ETHEREUM,
  ChainId.GOERLI,
  // ChainId.BSC,
  ChainId.BSC_TESTNET,
]

export default function GnbChainSelect() {
  const [showMenu, setShowMenu] = useState(false)

  function toggle(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    setShowMenu((prev) => !prev)
  }

  function closeMenu() {
    setShowMenu(false)
  }

  return (
    <StyledGnbChainSelect>
      <Toggle toggle={toggle} />

      <AnimatePresence>
        {showMenu && <Menu list={SUPPORTED_CHAINS} closeMenu={closeMenu} />}
      </AnimatePresence>
    </StyledGnbChainSelect>
  )
}
