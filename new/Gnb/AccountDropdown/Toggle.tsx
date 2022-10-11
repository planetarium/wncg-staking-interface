import type { MouseEvent } from 'react'
import styled from 'styled-components'

import { truncateAddress } from 'utils/string'
import { useAccount } from 'hooks'

import { Jazzicon } from 'components/Jazzicon'

const StyledAccountDropdownToggle = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: black;
`

type AccountDropdownToggleProps = {
  toggle(e: MouseEvent<HTMLButtonElement>): void
}

function AccountDropdownToggle({ toggle }: AccountDropdownToggleProps) {
  const { account } = useAccount()

  return (
    <StyledAccountDropdownToggle
      className="accountDropdownToggle"
      type="button"
      onClick={toggle}
    >
      <Jazzicon address={account} diameter={24} />
      <strong>{truncateAddress(account)}</strong>
    </StyledAccountDropdownToggle>
  )
}

export default AccountDropdownToggle
