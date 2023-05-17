import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { flexbox, textStyle } from 'styles/utils'

export const StyledDropdown = styled.div<{ $disabled?: boolean }>`
  position: relative;
  z-index: 1;
  transition: 200ms;

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.4;

      button {
        cursor: not-allowed;
        user-select: none;
      }
    `}
`

export const StyledDropdownMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 144px;
  padding: 8px;
  overflow: hidden;
  background-color: var(--white);
  border-radius: 8px;

  .menuItem {
    width: 100%;
    margin-top: 2px;

    &.selected {
      .label {
        font-weight: 700;
        color: var(--gray-900);
      }
    }

    &:first-child {
      margin-top: 0;
    }

    button {
      ${flexbox('start')}
      width: 100%;
      height: 40px;
      padding: 8px 8px 8px 12px;
      white-space: nowrap;
      text-align: left;
      color: var(--gray-500);
      border-radius: 4px;
      transition: 150ms;

      &:hover {
        background-color: var(--gray-100);
      }
    }

    .label {
      ${textStyle('body', 2)}
      flex-grow: 1;
      text-align: left;
      transition: 150ms;
      color: var(--gray-500);
    }

    .icon {
      flex-shrink: 0;
      color: var(--gray-900);
    }
  }
`

export const StyledDropdownToggle = styled.button`
  ${flexbox('start')}
  ${textStyle('body', 3)}
  font-weight: 700;
  color: rgba(var(--white), 0.9);
`
