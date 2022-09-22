import { AnimatePresence } from 'framer-motion'
import { memo } from 'react'
import { useRecoilValue } from 'recoil'

import { accountState } from 'app/states/connection'

import Account from './Account'
import Action from './Action'
import Claim from './Claim'
import Links from './Links'

function Gnb() {
  const account = useRecoilValue(accountState)

  return (
    <header>
      <h1>WNCG Staking</h1>
      <AnimatePresence>{account && <Action />}</AnimatePresence>
      <Claim />
      <Links />
      <Account />
    </header>
  )
}

export default memo(Gnb)
