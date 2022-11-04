import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { inlineFlexbox, posCenter, textStyle } from 'newStyles/utils'

import { buttonStyle } from 'components/Button/styled'

export const StyledActionDropdown = styled(motion.div)`
  position: relative;
  z-index: 1;
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

export const StyledActionDropdownUnstakeBadge = styled(motion.span)<{
  $active: boolean
}>`
  ${inlineFlexbox()}
  position: relative;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  margin-left: 10px;
  color: var(--white);
  border-radius: 50%;
  background-color: var(--gray-700);
  transition: 200ms;

  .icon {
    ${posCenter()}
    width: 18px;
    height: 18px;
    transition: 200ms;

    &.lock {
      transform: translate(-50%, -50%) scale(1);
    }

    &.unlock {
      opacity: 0;
      transform: translate(-50%, -52%) scale(0.8);
    }
  }

  ${({ $active }) =>
    $active &&
    css`
      background-color: var(--primary-500);

      .icon {
        &.lock {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.8);
        }

        &.unlock {
          opacity: 1;
          transform: translate(-50%, -52%) scale(1);
        }
      }
    `}
`
