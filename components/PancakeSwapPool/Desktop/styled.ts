import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { GUTTER_TABLET } from 'styles/constants/dimensions'

import {
  backdropFilter,
  flexbox,
  gradient,
  inlineFlexbox,
  media,
  noScrollbar,
  textStyle,
} from 'styles/utils'

const POOL_BALANCES_HEIGHT = 236
const POOL_BALANCES_COLLAPSE_BUTTON_HEIGHT = 50

export const StyledPoolDesktop = styled(motion.section)`
  ${flexbox('start', 'start')}
  ${backdropFilter(80, 'rgba(var(--black-rgb), 0.6)', 'var(--black)')}
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 32px);
  overflow: hidden;
  border-radius: 32px 32px 0 0;

  .utils {
    ${flexbox('end')}
    position: absolute;
    top: 0;
    left: 0;
    flex-shrink: 0;
    padding: 32px 48px 0;
    width: 100%;

    .closeButton {
      ${flexbox()}
      width: 32px;
      height: 32px;
      color: var(--white);

      svg {
        width: 32px;
        height: 32px;
      }
    }
  }

  .container {
    ${noScrollbar()}
    flex-grow: 1;
    width: 100%;
    max-width: 800px;
    padding: 56px 24px 64px !important;
    margin: 0 auto;
    overflow-x: hidden;
    overflow-y: auto;

    .left {
      grid-area: 'content';
    }

    .right {
      display: none;
      grid-area: 'sidebar';
    }
  }

  .poolInformation {
    margin-top: 48px;
  }

  .poolJoin {
    margin-top: 24px;
  }

  ${media(
    'minTablet',
    css`
      .container {
        padding-left: ${GUTTER_TABLET}px !important;
        padding-right: ${GUTTER_TABLET}px !important;
      }
    `
  )}

  ${media(
    'minLaptop',
    css`
      .container {
        ${noScrollbar()}
        flex-grow: 1;
        display: grid;
        grid-gap: 20px;
        grid-template-areas: 'left' 'right';
        grid-template-columns: 880px 400px;
        grid-column-gap: 48px;
        width: 100%;
        max-width: ${880 + 400 + 48}px;
        padding: 80px 0 64px !important;
        margin: 0 auto;
        overflow-x: hidden;
        overflow-y: auto;

        .left {
          grid-area: 'content';
        }

        .right {
          display: block;
          grid-area: 'sidebar';
        }
      }
    `
  )}

  ${media(
    'minDesktop',
    css`
      .container {
        display: grid;
        grid-gap: 20px;
        grid-template-areas: 'left' 'right';
        grid-template-columns: 880px 400px;
        grid-column-gap: 48px;
        width: 100%;
        max-width: ${880 + 400 + 48 + 48 * 2}px;
        padding: 80px 0 64px !important;
        margin: 0 auto;

        .left {
          grid-area: 'content';
        }

        .right {
          grid-area: 'sidebar';
        }
      }

      .poolInformation {
        display: block;
      }
    `
  )}
`

type StyledAddLiquidityPoolBalancesProps = {
  $show: boolean
  $overflow: 'hidden' | 'visible'
}

export const StyledAddLiquidityPoolBalances = styled(
  motion.section
)<StyledAddLiquidityPoolBalancesProps>`
  position: relative;
  max-height: ${POOL_BALANCES_HEIGHT + POOL_BALANCES_COLLAPSE_BUTTON_HEIGHT}px;
  overflow: ${({ $overflow }) => $overflow};
  border-radius: 12px;
  transition: 400ms;

  .balanceHeader {
    min-height: ${POOL_BALANCES_HEIGHT}px;
    padding: 32px;
    overflow: hidden;
    background-image: ${gradient(5)};
    background-color: var(--gray-900);
    border-radius: 12px 12px 0 0;

    .tokenGroup {
      ${flexbox()}

      .tokenIcon {
        &:not(:first-child) {
          margin-left: -12px;
        }
      }
    }

    .title {
      ${textStyle('body', 3)}
      width: min-content;
      margin: 12px auto 0;
      background-image: ${gradient(2)};
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 700;
      text-align: center;
      white-space: nowrap;
    }
  }

  .totalBalance {
    min-height: 60px;
    margin-top: 32px;

    dt {
      ${textStyle('body', 2)}
      color: rgba(var(--white-rgb), 0.6);
    }

    dd {
      ${flexbox('between')}
      margin-top: 12px;
      color: rgba(var(--white-rgb), 0.9);

      strong {
        ${textStyle('subtitle', 1)}
      }
    }

    .fiatValue {
      ${flexbox('end')}

      .icon {
        color: var(--gray-500);
      }
    }
  }

  .collapse {
    padding: 32px 32px ${POOL_BALANCES_COLLAPSE_BUTTON_HEIGHT}px;
    background-color: var(--white);
    border-radius: 0 0 12px 12px;
  }

  .collapseToggle {
    ${flexbox()}
    ${textStyle('body', 4)}
  position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: ${POOL_BALANCES_COLLAPSE_BUTTON_HEIGHT}px;
    padding: 0 16px;
    font-weight: 700;
    color: var(--gray-500);
    background-color: var(--white);
    border-radius: 0 0 12px 12px;
  }

  .availableBalance {
    padding-top: 32px;
    margin-top: 32px;
    box-shadow: 0 -1px 0 0 var(--gray-200);
  }

  .tooltipMessage {
    min-width: 280px;
  }

  .connectButton {
    ${textStyle('subtitle', 1)}
    font-weight: 700;
    color: rgba(var(--white-rgb), 0.9);
  }

  ${({ $show }) =>
    $show &&
    css`
      max-height: 1000px;
    `}
`

export const StyledPoolHeader = styled.header<{ $reverse: boolean }>`
  .poolName {
    ${textStyle('body', 3)}
    display: inline-block;
    font-weight: 700;
    background-image: ${gradient(4)};
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    opacity: 0.9;
  }

  .titleGroup {
    ${flexbox('between', 'end')}
    margin-top: 12px;
  }

  .connectButton {
    margin-top: 48px;
  }

  .title {
    ${textStyle('header', 5)}
    padding-right: 40px;
  }

  .tokenList {
    ${flexbox('end')}
    flex-direction: ${({ $reverse }) => ($reverse ? 'row-reverse' : 'row')};
    padding-top: 12px;
    padding-bottom: 8px;
    margin-left: 16px;
  }

  .tokenItem {
    ${flexbox('start')}
    ${textStyle('body', 3)}
    ${({ $reverse }) =>
      $reverse
        ? css`
            margin-right: 12px;

            &:first-child {
              margin-right: 0;
            }
          `
        : css`
            margin-left: 12px;

            &:first-child {
              margin-left: 0;
            }
          `}
    color: var(--gray-400);
    white-space: nowrap;

    .tokenIcon {
      margin-right: 4px;
    }

    .symbol {
      margin-right: 4px;
      font-weight: 700;
      color: var(--gray-25);
    }

    .extLink {
      ${inlineFlexbox()}
      width: 16px;
      height: 16px;
    }
  }

  ${media(
    'minLaptop',
    css`
      .title {
        ${textStyle('header', 4)}
        padding-right: 0;
      }

      .connectButton {
        display: none;
      }

      .tokenList {
        ${flexbox('start')}
        padding-bottom: 8px;
      }
    `
  )}
`

export const StyledPoolInformation = styled.section`
  .header {
    ${flexbox('start')}
    width: 100%;
    margin-bottom: 8px;
  }

  .title {
    ${textStyle('body', 3)}
    font-weight: 700;
  }

  .link {
    ${inlineFlexbox('start')}
    ${textStyle('body', 4)}
    margin-left: 8px;
    color: rgba(var(--white-rgb), 0.6);
  }

  .detailList {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 24px;
  }

  .detailItem {
    padding: 20px;
    overflow: hidden;
    background-color: rgba(var(--white-rgb), 0.05);
    border-radius: 8px;

    dt {
      ${textStyle('body', 3, 700)}
      color: rgba(var(--white-rgb), 0.6);
    }

    dd {
      text-align: right;
      margin-top: 12px;

      .number {
        ${textStyle('subtitle', 1)}
        color: var(--white);
      }
    }
  }

  ${media(
    'minLaptop',
    css`
      dd {
        .number {
          ${textStyle('title')}
        }
      }
    `
  )}
`

export const StyledPoolModalOverlay = styled(motion.div)<{
  $isSafari?: boolean
}>`
  ${backdropFilter(
    64,
    'rgba(var(--realBlack-rgb), 0.2)',
    'rgba(var(--realBlack-rgb), 0.8)'
  )}
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);

  ${media(
    'minTablet',
    css`
      cursor: pointer;
    `
  )}
`
