import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { flexbox, gradient, textStyle } from 'newStyles/utils'

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

const REWARD_TOGGLE_BUTTON_HEIGHT = 48

export const StyledActionDropdownRewards = styled.section<{ $open: boolean }>`
  width: 100%;
  overflow: hidden;
  max-height: ${REWARD_TOGGLE_BUTTON_HEIGHT}px;
  color: var(--white);
  background-image: ${gradient(1)};
  border-radius: 6px;
  transition: 400ms;

  .toggleButton {
    ${buttonStyle}
    ${textStyle('body', 3)}
    justify-content: space-between;
    width: 100%;
    height: ${REWARD_TOGGLE_BUTTON_HEIGHT}px;
    padding: 0 16px;
    font-weight: 700;
    color: var(--white);

    .icon {
      position: relative;
      transition: 200ms;
    }
  }

  .content {
    padding: 0 16px 16px;
  }

  .rewardList {
    pointer-events: none;
  }

  .rewardItem {
    ${flexbox('space-between')}
    ${textStyle('body', 3)}
    flex-direction: row-reverse;
    margin-top: 8px;

    &:first-child {
      margin-top: 0;
    }

    dt,
    strong {
      font-weight: 700;
    }

    dt {
      flex-shrink: 0;
      padding-left: 4px;
      color: rgba(var(--white-rgb), 0.6);
    }

    dd {
      flex-grow: 1;
    }
  }

  .amount {
    ${flexbox('flex-start')}
    white-space: nowrap;
  }

  .usd {
    flex-shrink: 0;
    margin-left: 4px;
  }

  ${({ $open }) =>
    $open &&
    css`
      max-height: 300px;

      .toggleButton {
        .icon {
          transform: rotate(90deg);
        }
      }
    `}
`
