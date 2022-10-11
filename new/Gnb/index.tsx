import { memo } from 'react'
import styled from 'styled-components'

import AccountDropdown from './AccountDropdown'
import ActionDropdown from './ActionDropdown'
import Claim from './Claim'
import MenuList from './MenuList'

const StyledGnb = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  background-color: #212121;

  .left,
  .right {
    display: flex;
    align-items: center;
  }

  .actionDropdown {
    margin-left: 20px;
  }

  .account {
    margin-left: 20px;
  }
`

function Gnb() {
  return (
    <StyledGnb className="gnb">
      <div className="left">
        <h1>WNCG Staking</h1>
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
