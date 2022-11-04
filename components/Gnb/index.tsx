import { memo } from 'react'
import Link from 'next/link'

import { StyledGnb } from './styled'
import AccountDropdown from './AccountDropdown'
import ActionDropdown from './ActionDropdown'
import Claim from './Claim'
import MenuList from './MenuList'

function Gnb() {
  return (
    <StyledGnb className="gnb">
      <div className="left">
        <h1 className="logo">
          <Link href="/wncg">WNCG Staking</Link>
        </h1>
        <ActionDropdown />
      </div>

      <div className="right">
        <MenuList />
        <AccountDropdown />
      </div>

      <Claim />
    </StyledGnb>
  )
}

export default memo(Gnb)
