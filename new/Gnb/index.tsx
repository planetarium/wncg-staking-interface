import { memo } from 'react'
import styled from 'styled-components'

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
  return <StyledGnb className="gnb">Gnb</StyledGnb>
}

export default memo(Gnb)
