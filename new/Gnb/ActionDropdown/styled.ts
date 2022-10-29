import { motion } from 'framer-motion'
import styled from 'styled-components'

import { gradient, textStyle } from 'newStyles/utils'

import { buttonStyle } from 'new/Button/styled'

export const StyledActionDropdown = styled(motion.div)`
  position: relative;
  z-index: 1;
`

export const StyledActionDropdownMenu = styled(motion.aside)`
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  z-index: 1;
  width: 360px;
  padding: 24px;
  background-color: var(--white);
  border-radius: 8px;

  .availableBalance {
    padding-top: 32px;
    margin-top: 32px;
    box-shadow: 0 -1px 0 0 var(--gray-200);
  }

  .tooltipMessage {
    min-width: 280px;
  }

  .buttonGroup {
    margin-top: 16px;

    button {
      margin-top: 16px;

      &:first-child {
        margin-top: 0;
      }
    }
  }

  .earnButton {
    ${buttonStyle}
    ${textStyle('body', 3)}
    justify-content: space-between;
    width: 100%;
    height: 48px;
    padding: 0 16px;
    font-weight: 700;
    color: var(--white);
    background-image: ${gradient(1)};
    border-radius: 6px;
  }
`

export const StyledActionDropdownToggle = styled.button`
  ${buttonStyle}
  ${textStyle('body', 3)}
  position: relative;
  padding: 12px 20px;
  color: var(--white);
  background-color: rgba(var(--white-rgb), 0.05);
  border-radius: 40px;

  .icon,
  .amount {
    flex-shrink: 0;
  }

  .label {
    margin: 0 4px;

    &::after {
      margin-left: 2px;
      content: ':';
    }
  }
`
