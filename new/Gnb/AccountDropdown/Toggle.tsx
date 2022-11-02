import type { MouseEvent } from 'react'

import { truncateAddress } from 'utils/string'
import { useAccount } from 'hooks'

import { StyledAccountDropdownToggle } from './styled'
import Jazzicon from 'new/Jazzicon'
import SvgIcon from 'new/SvgIcon'

type AccountDropdownToggleProps = {
  toggle(e: MouseEvent<HTMLButtonElement>): void
}

function AccountDropdownToggle({ toggle }: AccountDropdownToggleProps) {
  const { account } = useAccount()

  return (
    <StyledAccountDropdownToggle
      id="accountDropdown"
      className="accountDropdownToggle"
      type="button"
      onClick={toggle}
      aria-controls="menu"
      aria-haspopup
    >
      <Jazzicon className="avatar" address={account} diameter={24} />
      <strong className="address">{truncateAddress(account, 5, 4)}</strong>
      <SvgIcon icon="check" $size={24} />
    </StyledAccountDropdownToggle>
  )
}

export default AccountDropdownToggle
