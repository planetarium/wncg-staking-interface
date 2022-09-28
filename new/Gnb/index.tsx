import { memo } from 'react'

import Account from './Account'
import Action from './Action'
import Claim from './Claim'
import Links from './Links'

function Gnb() {
  return (
    <header>
      <h1>WNCG Staking</h1>
      <Action />
      <Links />
      <Account />
      <Claim />
    </header>
  )
}

export default memo(Gnb)
