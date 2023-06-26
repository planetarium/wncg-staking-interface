import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { GUTTER_TABLET } from 'styles/constants/dimensions'
import {
  backdropFilter,
  flexbox,
  gradient,
  media,
  posCenterX,
  scrollbar,
  textStyle,
} from 'styles/utils'

import { buttonStyle } from 'components/Button/styled'

const COMPLETE_LOTTIE_SIZE = 80
const CLOSE_BUTTON_SIZE_MOBILE = 24
const CLOSE_BUTTON_SIZE_LAPTOP = 32

export const StyledModalPage = styled(motion.div)<{ $disabled?: boolean }>`
  ${flexbox('start', 'stretch')}
  ${backdropFilter(40, 'rgba(var(--white-rgb), 0.08)', 'var(--black)')}
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  padding: 32px 24px 48px !important;
  max-height: calc(100vh - 48px);
  margin: 0 auto;
  overflow: hidden;
  border-radius: 24px 24px 0 0;
  box-shadow: 0px 4px 48px rgba(var(--realBlack-rgb), 0.24);

  &::before {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 180px;
    content: '';
    background-image: linear-gradient(
      180deg,
      transparent,
      rgba(7, 3, 22, 0) 1.14%,
      #080316 25.3%
    );
    pointer-events: none;
    user-select: none;
  }

  .modalHeader,
  .modalFooter,
  .container {
    position: relative;

    &:last-child {
      padding-bottom: 0;
      margin-bottom: 0;
    }
  }

  .modalHeader,
  .modalFooter,
  .pendingNotice {
    flex-shrink: 0;
  }

  .modalHeader,
  .modalFooter {
    width: 100%;
  }

  .modalHeader {
    position: relative;

    & + .modalFooter {
      margin-top: 40px;
    }

    .closeButton {
      position: absolute;
      top: 2px;
      right: 0;
    }

    .titleGroup {
      padding-right: ${16 + CLOSE_BUTTON_SIZE_MOBILE}px;

      .title,
      .subtitle {
        &:first-child {
          margin-top: 0;
        }
      }
    }

    .title {
      ${textStyle('title', 1)}
      color: var(--white);

      &.accent {
        ${textStyle('body', 3, 700)}
      }
    }

    .subtitle {
      ${textStyle('title', 1)}
      margin-top: 12px;
    }

    .accent {
      color: var(--primary-300);
    }
  }

  .desc {
    ${textStyle('body', 4)}
    margin-top: 8px;
    color: rgba(var(--white-rgb), 0.6);
  }

  .container {
    ${scrollbar()}
    flex-grow: 1;
    max-height: 100%;
    padding-top: ${40 / 2}px;
    padding-bottom: ${48 / 2}px;
    margin-top: ${40 / 2}px;
    margin-bottom: ${48 / 2}px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .modalFooter {
    &:has(.checkout) {
      padding-top: 24px;
    }

    .checkout {
      & + a,
      & + button {
        margin-top: 0;
      }
    }

    a,
    button {
      margin-top: 12px;

      &:first-child {
        margin-top: 0;
      }
    }
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      .modalContent,
      .modalFooter {
        opacity: 0.5;
      }
    `}

  ${media(
    'minTablet',
    css`
      max-height: calc(100vh - 32px);
      padding-right: ${GUTTER_TABLET}px !important;
      padding-left: ${GUTTER_TABLET}px !important;

      &::before {
        display: none;
      }

      .modalFooter {
        &:has(.checkout) {
          padding-top: 0;
        }
      }
    `
  )}

  ${media(
    'minSmLaptop',
    css`
      width: 640px;
      max-height: calc(100vh - ${48 * 2}px);
      padding: 48px !important;
      border-radius: 16px;

      &::before {
        display: none;
      }

      .modalHeader {
        position: relative;
        padding-top: 0;
        padding-right: 0;

        .closeButton {
          top: 0;
        }

        .titleGroup {
          padding-right: ${32 + 24}px;
        }

        .title {
          ${textStyle('header', 6)}
          color: var(--white);

          &.accent {
            ${textStyle('body', 3)}
            margin-bottom: 8px;
            font-weight: 700;
            color: var(--primary-300);
          }
        }

        .subtitle {
          ${textStyle('header', 6)}
        }
      }

      .desc {
        ${textStyle('body', 2)}
        margin-top: 8px;
        color: rgba(var(--white-rgb), 0.6);
      }

      .container {
        padding-top: ${40 / 2}px;
        padding-bottom: ${40 / 2}px;
        margin-top: ${40 / 2}px;
        margin-bottom: ${40 / 2}px;
      }

      .modalContent,
      .modalFooter {
        transition: opacity 250ms;
      }

      .modalFooter {
        padding-bottom: 0;

        .buttonGroup {
          ${flexbox()}

          button {
            margin-top: 0;
            margin-left: 16px;

            &:first-child {
              margin-left: 0;
            }
          }
        }
      }

      .pendingNotice {
        flex-shrink: 0;
      }
    `
  )}
`

export const StyledModalCompletePage = styled(StyledModalPage)`
  ${flexbox()}
  flex-direction: column;

  &:has(.confetti) {
    overflow: visible;
  }

  .confetti {
    ${posCenterX()}
    width: 640px !important;
    height: 480px !important;
    transform: translate3d(-50%, -${COMPLETE_LOTTIE_SIZE}px, 0);
    pointer-events: none;

    > div {
      width: 640px !important;
      height: 480px !important;

      svg {
        width: 640px !important;
        height: 480px !important;
      }
    }
  }

  .tokenSymbol {
    ${flexbox()}
    ${textStyle('body', 3, 700)}
    height: 36px;
    padding: 0 12px;
    margin-bottom: 8px;
    border-radius: 4px;
    background-color: rgba(var(--white-rgb), 0.08);

    > .tokenIcon,
    > .tokenIconGroup {
      margin-right: 8px;
    }
  }

  .modalHeader,
  .modalFooter,
  .modalContent {
    width: 100%;
    padding: 0 !important;
    padding-top: 0;
  }

  .modalHeader {
    ${flexbox()}
    flex-direction: column;
    text-align: center;

    .title {
      color: var(--white);
      text-align: center;
    }

    + .modalFooter {
      margin-top: 40px !important;
    }
  }

  .lottie {
    ${flexbox()}
    width: 80px;
    height: 80px;
    margin-bottom: 24px;

    svg {
      width: 100px !important;
      height: 100px !important;
    }
  }

  .detailList {
    width: 100%;
    padding: 20px 24px;
    overflow: hidden;
    background-color: var(--gray-200);
    border-radius: 6px;
  }

  .detailItem {
    ${flexbox('between', 'start')}
    ${textStyle('body', 3)}
    margin-top: 12px;

    &.accent {
      dd,
      .number,
      .fiatValue {
        color: var(--primary-500) !important;
      }
    }

    &:first-child {
      margin-top: 0;
    }

    &.total {
      padding-top: 16px;
      margin-top: 16px;
      border-top: 1.5px solid var(--gray-300);

      .usd {
        ${textStyle('body', 3)}
        margin-top: 2px;
        color: var(--gray-500);
      }

      dd {
        ${textStyle('body', 3)}
        width: 180px;
        font-weight: 700;
        color: var(--gray-700);
      }
    }

    .active,
    .active + .symbol {
      color: var(--primary-500);
    }

    dt {
      ${textStyle('body', 3)}
      white-space: nowrap;
      color: var(--gray-500);
    }

    dd {
      ${textStyle('body', 3)}
      width: 180px;
      color: var(--gray-700);
      font-weight: 700;
      word-break: break-all;
      text-align: right;

      .active,
      .active + .symbol {
        color: var(--primary-500);
      }

      .symbol {
        ${textStyle('caption')}
        margin-left: 0.25em;
        font-weight: 700;
      }

      .number {
        ${textStyle('body', 3, 700)}

        &.usd {
          ${textStyle('body', 3)}
          display: block;
          color: var(--gray-500);
        }
      }
    }
  }

  .modalFooter {
    button {
      margin-top: 16px;

      &:first-child {
        margin-top: 0;
      }
    }
  }

  ${media(
    'minSmLaptop',
    css`
      max-width: 480px !important;
    `
  )}
`

export const StyledModalFailPage = styled(StyledModalCompletePage)`
  .modalContent {
    ${textStyle('body', 2)}
    margin-top: 8px;
    text-align: center;
    color: var(--gray-400);
  }
`

export const StyledModalApprovePage = styled(StyledModalPage)``

export const StyledCheckout = styled.output<{ $active: boolean }>`
  ${flexbox()}
  width: 100%;
  padding-top: 0;
  padding-bottom: 20px;

  .text {
    ${textStyle('body', 3)}
    text-align: right;
  }

  .value {
    ${flexbox('start')}
    color: var(--white);
    transition: 150ms;
    margin-left: 8px;

    .symbol {
      ${textStyle('title')}
    }
  }

  .countUp {
    ${textStyle('subtitle', 1)}
  }

  ${media(
    'minSmLaptop',
    css`
      .countUp {
        ${textStyle('title')}
      }
    `
  )}

  ${({ $active }) =>
    $active &&
    css`
      .value {
        color: var(--primary-300);
      }
    `}
`

export const StyledCloseButton = styled.button`
  ${flexbox()}
  width: ${CLOSE_BUTTON_SIZE_MOBILE}px;
  height: ${CLOSE_BUTTON_SIZE_MOBILE}px;
  color: var(--white);

  ${media(
    'minSmLaptop',
    css`
      width: ${CLOSE_BUTTON_SIZE_LAPTOP}px;
      height: ${CLOSE_BUTTON_SIZE_LAPTOP}px;
    `
  )}
`

export const StyledPendingNotice = styled(motion.footer)`
  ${flexbox('start')}
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 36px;
  padding: 0 24px;
  overflow: hidden;
  background-image: ${gradient(2)};

  .lottie {
    display: none;
  }

  .content {
    flex-grow: 1;
  }

  .title {
    ${textStyle('body', 4, 700)}
    margin: 0;
    color: var(--white);

    &:after {
      content: '...';
    }
  }

  .desc {
    display: none;
  }

  .extLink {
    ${flexbox()}

    .explorer {
      display: none;
    }

    .icon {
      width: 16px;
      height: 16px;
      color: var(--primary-25);
    }
  }

  ${media(
    'minSmLaptop',
    css`
      ${flexbox('start')}
      position: relative;
      bottom: auto;
      left: auto;
      width: auto;
      height: 72px;
      padding-right: 16px;
      padding-left: 12px;
      margin: 48px -48px -48px;
      overflow: hidden;
      border-radius: 0 0 16px 16px;
      background-image: ${gradient(2)};

      .lottie {
        display: block;
        width: 48px;
        height: 48px;
        margin-right: 4px;

        > div {
          ${flexbox()}
          width: 48px;
          height: 48px;
        }

        svg {
          width: 40px !important;
          height: 40px !important;
        }
      }

      .content {
        flex-grow: 1;
      }

      .title {
        ${textStyle('body', 2, 700)}

        &::after {
          display: none;
        }
      }

      .desc {
        ${textStyle('body', 4)}
        display: block;
        margin: 0;
        color: rgba(var(--white-rgb), 0.6);
      }

      .extLink {
        ${buttonStyle}
        ${textStyle('caption')}
        flex-grow: 0;
        flex-shrink: 0;
        width: auto;
        padding: 8px 16px;
        font-weight: 700;
        color: var(--primary-500);
        background-color: var(--white);
        border-radius: 100px;

        .explorer {
          display: block;
        }

        .icon {
          flex-shrink: 0;
          margin-right: -4px;
          margin-left: 4px;
          color: var(--primary-500);
        }
      }
    `
  )}
`
