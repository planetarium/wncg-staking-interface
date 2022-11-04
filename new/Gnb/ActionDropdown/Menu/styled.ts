import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { flexbox, gradient, textStyle } from 'newStyles/utils'

import { buttonStyle } from 'new/Button/styled'

const REWARD_TOGGLE_BUTTON_HEIGHT = 48

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

  .actionDropdownRewards,
  .actionButton {
    margin-top: 16px;
  }

  .unstakePeriod {
    margin-top: 16px;
  }
`

export const StyledActionDropdownMenuRewards = styled.section<{
  $open: boolean
}>`
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

  .claimButton {
    margin-top: 16px;
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

export const StyledActionDropdownMenuUnstakePeriod = styled(motion.section)<{
  $active: boolean
}>`
  overflow: hidden;
  background-color: var(--gray-200);
  border-radius: 12px;
  transition: 400ms;

  .header {
    ${flexbox()}
    height: 48px;
    color: var(--gray-600);
    user-select: none;
    transition: 300ms;

    .title {
      ${textStyle('body', 2)}
      margin-bottom: 0;
      color: var(--gray-600);
      font-weight: 700;
      transition: 300ms;
    }

    .icon {
      flex-shrink: 0;
      margin-right: 4px;
    }
  }

  .detailList {
    ${flexbox('space-between')}
    position: relative;
    width: 100%;
    height: 48px;
    padding: 0 12px;
    background-color: var(--gray-500);
    transition: 300ms;

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      pointer-events: none;
      transition: 250ms;
      background-position: center center;
      background-size: 100% 100%;
      transition: 400ms;
    }
  }

  .detailItem {
    color: var(--white);

    &.timeDistance {
      dd {
        font-weight: 700;
      }
    }

    &.timePeriod {
      dd {
        width: 100%;
        text-align: right;
      }
    }

    .tilde {
      &::before {
        margin-right: 4px;
        content: '~';
      }
    }

    dd {
      ${textStyle('body', 4)}
      display: block;
      color: var(--white);
    }
  }

  ${({ $active }) =>
    $active &&
    css`
      background-color: var(--primary-50);

      .header,
      .header .title {
        color: var(--primary-600);
      }

      .detailList {
        background-color: var(--primary-500);

        &::before {
          opacity: 1;
        }
      }
    `}
`
