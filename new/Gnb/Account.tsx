import { memo } from 'react'
import styled from 'styled-components'

const StyledAccount = styled.div`
  background-color: yellow;
  color: black;
`

function Account() {
  return <StyledAccount>Account</StyledAccount>
}

export default memo(Account)
