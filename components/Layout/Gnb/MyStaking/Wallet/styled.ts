import styled, { css } from 'styled-components'
import { motion } from 'framer-motion'

import {
  GNB_DROPDOWN_MENU_WIDTH,
  GNB_HEIGHT_TABLET,
} from 'styles/constants/dimensions'
import {
  flexbox,
  gradient,
  inlineFlexbox,
  textGradient,
  textStyle,
} from 'styles/utils'

export const StyledMyStakingWallet = styled(motion.aside)`
  ${flexbox('start', 'stretch')}
  flex-direction: column;
  flex-grow: 1;
  position: absolute;
  top: calc(100% + 8px);
  left: -16px;
  width: ${GNB_DROPDOWN_MENU_WIDTH}px;
  max-height: calc(100vh - ${GNB_HEIGHT_TABLET + 20}px);
  overflow-x: hidden;
  overflow-y: auto;
  padding: 24px;
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.48);

  > * {
    flex-shrink: 0;
  }

  .divider {
    display: block;
    margin: 32px 0;
    border: 1px solid var(--gray-200);
    border-radius: 10px;
  }
`

export const StyledMyStakingWalletSection = styled.section`
  .title {
    ${textStyle('body', 2)}
    font-weight: 700;
    color: var(--gray-500);
  }

  .amount {
    ${flexbox('start')}
    flex-wrap: wrap;
    margin-top: 4px;
    white-space: nowrap;

    .countUp {
      ${textStyle('title', 1)}
      color: var(--black);
      margin-right: 4px;
    }

    .number {
      ${textStyle('body', 2)}
      color: var(--gray-500);
    }
  }

  .content {
    margin-top: 16px;
  }

  .actionButton {
    margin-top: 16px;
  }
`

export const StyledWalletStaking = styled(StyledMyStakingWalletSection)`
  width: 100%;

  .revenueButton {
    ${flexbox('start')}
    width: 100%;
    padding: 8px 12px;
    margin-top: 8px;
    margin-bottom: -8px;
    background-color: var(--primary-900);
    border-radius: 8px;

    .icon {
      margin-right: 4px;
      color: var(--primary-50);
    }

    .label {
      ${textStyle('body', 3, 700)}
      ${textGradient(3)}
      display: block;
      text-shadow: 0px 4px 8px rgba(var(--black-rgb), 0.48);
      color: var(--white);
    }
  }
`

export const StyledWalletBonusRewards = styled.div<{ $show: boolean }>`
  width: 100%;
  max-height: 48px;
  margin-top: 16px;
  overflow: hidden;
  background-image: ${gradient(1)};
  border-radius: 6px;
  will-change: max-height;
  transition: 300ms;

  .rewardToggle {
    ${flexbox('between')}
    ${textStyle('body', 3, 700)}
    width: 100%;
    height: 48px;
    padding: 0 16px;
    color: var(--white);
  }

  .rewardList {
    width: 100%;
    padding: 16px;
    padding-top: 0;
    color: var(--white);
    opacity: 0;
    transition: 150ms;

    .claimButton {
      ${textStyle('button', 3)}
    }

    .plus {
      &::before {
        margin-left: 0;
      }
    }
  }

  .rewardItem {
    ${flexbox('between', 'start')}
    ${textStyle('body', 3)}
    flex-direction: row-reverse;
    margin-top: 8px;

    &:first-child {
      margin-top: 0;
    }

    dt {
      ${flexbox('start')}
      ${textStyle('body', 3, 700)}
      flex-shrink: 0;
      margin-right: 4px;
      color: rgba(var(--white-rgb), 0.6);
    }

    dd {
      ${flexbox('start')}
      flex-grow: 1;
      flex-wrap: wrap;
      text-align: left;

      .countUp {
        font-weight: 700;
        margin-right: 4px;
      }

      .symbol {
        margin-left: 4px;
        font-weight: 700;
        color: rgba(var(--white-rgb), 0.6);
      }

      .parenthesis {
        ${inlineFlexbox('start')}
      }

      .number {
        font-weight: 500;
        color: var(--white);

        &::before {
          margin-right: 0;
        }
      }
    }
  }

  ${({ $show }) =>
    $show &&
    css`
      max-height: 200px;

      .rewardList {
        opacity: 1;
      }
    `}
`

export const StyledWalletSingleRewards = styled.dl`
  width: 100%;
  padding: 16px;
  margin-top: ${16 + 8}px; // NOTE: revenueButton mb -8px
  color: var(--white);
  border-radius: 6px;
  background-image: ${gradient(1)};
  will-change: max-height;
  transition: 300ms;

  .claimButton {
    ${textStyle('button', 3)}
  }

  .rewardItem {
    ${flexbox('between')}
    ${textStyle('body', 3)}
    

    &:first-child {
      padding: 5px 0;
    }

    &:last-child:not(:only-child) {
      dd {
        margin-top: 10px;
      }
    }

    dt {
      ${flexbox('start')}
      flex-shrink: 0;
      margin-right: 8px;
      color: rgba(var(--white-rgb), 0.6);
    }

    dd {
      ${flexbox('start')}
      flex-wrap: wrap;
      flex-grow: 1;
      text-align: left;

      .countUp {
        margin-right: 4px;
        font-weight: 700;
      }

      .symbol {
        font-weight: 700;
        color: rgba(var(--white-rgb), 0.6);
      }

      .parenthesis {
        ${inlineFlexbox('start')}
      }

      .number {
        font-weight: 500;
        color: var(--white);

        &::before {
          margin-right: 0;
        }
      }
    }
  }
`

type StyledWalletUnstakeWindowProps = {
  $unstake?: boolean
}

export const StyledWalletUnstakeWindow = styled.div<StyledWalletUnstakeWindowProps>`
  margin-top: 16px;
  border-radius: 6px;
  overflow: hidden;

  .title {
    ${flexbox()}
    ${textStyle('button', 2)}
    width: 100%;
    height: 48px;
    text-align: center;
    color: var(--gray-600);
    background-color: var(--gray-200);

    .icon {
      margin-right: 4px;
    }
  }

  .content {
    ${flexbox('between')}
    ${textStyle('body', 4)}
    width: 100%;
    height: 48px;
    padding: 0 12px;
    color: var(--white);
    background-color: var(--gray-500);
  }

  .timer {
    ${textStyle('button', 2)}
  }

  .timer,
  .period {
    width: 50%;
  }

  .timer {
    ${textStyle('body', 4)}
    padding-right: 4px;
    font-weight: 700;
    text-align: left;
  }

  .period {
    padding-left: 4px;
    text-align: right;

    time {
      display: block;
    }
  }

  ${({ $unstake }) =>
    $unstake &&
    css`
      cursor: pointer;

      .title {
        color: var(--primary-500);
        background-color: var(--primary-50);
      }

      .content {
        background-image: ${gradient(2)};
      }
    `}
`
