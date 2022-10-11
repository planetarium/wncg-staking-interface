import type { MouseEvent } from 'react'
import styled from 'styled-components'

import { useStakedBalance } from 'hooks'

import NumberFormat from 'new/NumberFormat'

const StyledActionDropdownToggle = styled.button`
  position: relative;
  height: 40px;
  padding: 8px;
  background-color: #fff;
`

type ActionDropdownToggleProps = {
  toggle(e: MouseEvent<HTMLButtonElement>): void
}

function ActionDropdownToggle({ toggle }: ActionDropdownToggleProps) {
  const { stakedBalance } = useStakedBalance()

  return (
    <StyledActionDropdownToggle
      className="actionDropdownToggle"
      type="button"
      onClick={toggle}
    >
      {/* Icon */}
      My Staked LP :
      <strong>
        <NumberFormat value={stakedBalance} decimalScale={4} prefix="$" />
      </strong>
    </StyledActionDropdownToggle>
  )
}

export default ActionDropdownToggle
