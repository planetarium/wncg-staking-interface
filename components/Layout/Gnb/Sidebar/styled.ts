import {
  GNB_HEIGHT_MOBILE,
  GNB_HEIGHT_TABLET,
  SIDEBAR_PADDING_MOBILE,
  SIDEBAR_PADDING_TABLET,
} from 'styles/constants/dimensions'
import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import {
  flexbox,
  gradient,
  media,
  noScrollbar,
  textGradient,
  textStyle,
} from 'styles/utils'
import { buttonStyle } from 'components/Button/styled'

export const StyledGnbSidebar = styled.div`
  position: fixed;
  width: 100%;
  max-width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  overflow: hidden;

  ${media(
    'minLaptop',
    css`
      display: none !important;
    `
  )}
`

export const StyledGnbSidebarContent = styled(motion.aside)`
  ${flexbox('start', 'start')}
  position: absolute;
  top: 0;
  right: 0;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-height: 100vh;
  padding: 0 ${SIDEBAR_PADDING_MOBILE}px;
  background-color: rgba(var(--white-rgb), 0.08);
  backdrop-filter: blur(12px);
  box-shadow: 0px -16px 48px rgba(0, 0, 0, 0.48);

  > .header {
    ${flexbox('end')}
    width: 100%;
    height: ${GNB_HEIGHT_MOBILE}px;

    .closeButton {
      width: ${GNB_HEIGHT_MOBILE}px;
      height: ${GNB_HEIGHT_MOBILE}px;
      margin-right: -${(60 - 24) / 2}px;
      color: var(--white);
    }
  }

  > .content {
    ${noScrollbar()}
    min-width: 100%;
    align-self: stretch;
    flex-grow: 1;
    margin-top: 16px;
    overflow-y: auto;
    scrollbar-width: none;

    .sidebarList {
      min-height: calc(100% - ${48 * 2 + 36}px);
    }
  }

  ${media(
    'minTablet',
    css`
      max-width: ${375 + SIDEBAR_PADDING_TABLET * 2}px;
      padding: 0 ${SIDEBAR_PADDING_TABLET}px;

      > .header {
        height: ${GNB_HEIGHT_TABLET}px;
      }
    `
  )}

  ${media(
    'minLaptop',
    css`
      background: rgba(0, 0, 0, 0.64);
      backdrop-filter: blur(32px);
    `
  )}
`

export const StyledGnbSidebarOverlay = styled(motion.div)`
  width: 100%;
  height: 100vh;
  background-color: rgba(var(--realBlack-rgb), 0.64);
`

type StyledSidebarContentItemProps = {
  $expanded?: boolean
  $unstakeWindow?: boolean
}

const StyledSidebarContentItem = styled(
  motion.section
)<StyledSidebarContentItemProps>`
  padding-bottom: 32px;
  max-height: 132px;
  margin-top: 32px;
  overflow: hidden;
  box-shadow: 0 1px 0 0 rgba(var(--white-rgb), 0.1);
  will-change: max-height;
  transition: 300ms;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    box-shadow: none;
  }

  .header {
    ${flexbox('start', 'start')}
    flex-direction: column;
    margin-top: 0;

    .title {
      ${textStyle('body', 3)}
      width: 100%;
      margin-bottom: 16px;
      color: var(--gray-400);
    }

    .toggleButton {
      ${flexbox('start')}
      width: 100%;

      .address,
      .countUp {
        flex-grow: 1;
        color: var(--white);
        text-align: left;
      }

      .address {
        ${textStyle('body', 2)}
        font-weight: 700;
      }

      .countUp {
        ${textStyle('title', 1)}
      }

      .icon {
        color: var(--white);
      }
    }
  }

  .content {
    margin-top: ${16 + 8}px;
  }

  .detailItem {
    ${flexbox('between', 'start')}
    flex-wrap: wrap;
    padding-top: 24px;

    &:first-child {
      padding-top: 0;
    }

    .amount {
      ${flexbox('start', 'end')}
      flex-direction: column;
      width: max-content;
      margin-top: 0;
      white-space: nowrap;

      .countUp {
        ${textStyle('body', 3)}
        color: var(--gray-500);
      }

      .number {
        ${textStyle('body', 2, 700)}
        color: var(--white);
      }
    }

    dt {
      ${flexbox('start')}
      ${textStyle('body', 3)}
      color: var(--gray-400);

      .tokenIcon {
        margin-right: 4px;
      }
    }

    dd {
      width: 100%;

      &:has(button) {
        margin-top: 16px;
      }
    }
  }

  ${({ $expanded }) =>
    $expanded &&
    css`
      max-height: 400px;
    `}

  ${({ $expanded, $unstakeWindow }) =>
    $expanded &&
    $unstakeWindow &&
    css`
      max-height: 450px;
    `}
`

export const StyledSidebarAccount = styled(StyledSidebarContentItem)`
  .toggleButton {
    width: 100%;

    .jazzicon {
      margin-right: 8px;
    }

    .address {
      ${textStyle('body', 2)}
      flex-grow: 1;
      font-weight: 700;
      color: var(--white);
      text-align: left;
    }
  }

  .buttonGroup {
    ${flexbox('between')}

    .copied {
      .text {
        text-align: right;
      }
    }

    a,
    button {
      ${buttonStyle}
      ${textStyle('body', 4)}
      width: 50%;
      padding: 12px 18px;
      margin-left: 12px;
      color: var(--gray-400);
      background-color: rgba(var(--gray-100-rgb), 0.08);
      border-radius: 4px;

      &:first-child {
        margin-left: 0;
      }

      .text {
        flex-grow: 1;
        text-align: left;
      }

      .icon {
        flex-shrink: 0;
        margin-left: 8px;
        color: var(--gray-500);
      }
    }
  }

  .accountDetails {
    margin-top: 24px;
  }

  .accountDetailList {
    margin-top: 24px;
  }

  .accountDetailItem {
    ${flexbox('between')}
    margin-top: 12px;

    &:first-child {
      margin-bottom: 0;
    }

    dt {
      ${textStyle('body', 3)}
      color: var(--gray-400);
      margin-bottom: 0;
    }

    dd {
      ${flexbox('end')}
      ${textStyle('body', 3)}
      font-weight: 700;
      color: var(--gray-100);
      text-align: right;
      white-space: nowrap;
    }

    .dot {
      display: block;
      width: 8px;
      height: 8px;
      margin-right: 12px;
      background-color: var(--primary-500);
      border-radius: 50%;
      box-shadow: 0px 4px 12px rgba(var(--primary-600-rgb), 0.4);
    }
  }

  .disconnectButton {
    margin-top: 24px;
  }

  ${({ $expanded }) =>
    $expanded &&
    css`
      max-height: ${132 + 246}px;
    `}
`

export const StyledSidebarStaking = styled(StyledSidebarContentItem)`
  .revenueButton {
    ${flexbox('start')}
    width: 100%;

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

export const StyledSidebarRewards = styled(StyledSidebarContentItem)`
  .claimButton {
    margin-top: 16px;
  }
`

export const StyledSidebarMenuList = styled.ul`
  ${flexbox('between')}
  ${textStyle('body', 3)}
  width: 100%;
  padding: 48px 0;
  color: var(--gray-400);

  a,
  button {
    padding: 8px 20px;
  }
`

type StyledWalletUnstakeWindowProps = {
  $unstake?: boolean
}

export const StyledWalletUnstakeWindow = styled.div<StyledWalletUnstakeWindowProps>`
  width: 100%;
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
    height: 52px;
    padding: 0 12px;
    margin-top: 0;
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
