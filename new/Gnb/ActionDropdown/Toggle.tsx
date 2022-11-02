import type { MouseEvent } from 'react'

import { countUpOption } from 'constants/countUp'
import { useStakedBalance } from 'hooks'

import { StyledActionDropdownToggle } from './styled'
import CountUp from 'new/CountUp'
import SvgIcon from 'new/SvgIcon'

type ActionDropdownToggleProps = {
  toggle(e: MouseEvent<HTMLButtonElement>): void
}

function ActionDropdownToggle({ toggle }: ActionDropdownToggleProps) {
  const { stakedBalance } = useStakedBalance()

  return (
    <StyledActionDropdownToggle
      id="actionDropdown"
      className="actionDropdownToggle"
      type="button"
      onClick={toggle}
      aria-controls="menu"
      aria-haspopup
    >
      <SvgIcon icon="coin" $size={24} />
      <span className="label">My Staked LP</span>
      <strong className="amount">
        <CountUp
          {...countUpOption}
          end={stakedBalance}
          decimals={4}
          prefix="$"
        />
      </strong>
    </StyledActionDropdownToggle>
  )
}

export default ActionDropdownToggle
