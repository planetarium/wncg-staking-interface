import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { flexbox, gradient, inlineFlexbox, textStyle } from 'newStyles/utils'

const POOL_BALANCES_HEIGHT = 236
const POOL_BALANCES_COLLAPSE_BUTTON_HEIGHT = 50

const modalStyle = css`
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: calc(100vh - 32px);
  overflow-x: hidden;
  overflow-y: auto;
  background-color: rgba(18, 18, 18, 0.6);
  backdrop-filter: blur(40px);
  border-radius: 32px 32px 0 0;
`

const pageStyle = css``

type StyledWncgPoolProps = {
  $isModal: boolean
}

export const StyledWncgPool = styled.div<StyledWncgPoolProps>`
  ${({ $isModal }) => ($isModal ? modalStyle : pageStyle)}

  .container {
    display: grid;
    grid-gap: 20px;
    grid-template-areas: 'left' 'right';
    grid-template-columns: 880px 400px;
    grid-column-gap: 48px;
    width: 100%;
    padding-top: 80px;
    padding-bottom: 158px;
    max-width: ${880 + 400 + 48}px;
    margin: 0 auto;

    .left {
      grid-area: 'content';
    }

    .right {
      grid-area: 'sidebar';
    }
  }

  .poolInformation {
    margin-top: 48px;
  }

  .poolJoin {
    margin-top: 24px;
  }
`

type StyledPoolBalancesProps = {
  $show: boolean
  $overflow: 'hidden' | 'visible'
}

export const StyledPoolBalances = styled(
  motion.section
)<StyledPoolBalancesProps>`
  position: relative;
  max-height: ${POOL_BALANCES_HEIGHT + POOL_BALANCES_COLLAPSE_BUTTON_HEIGHT}px;
  overflow: ${({ $overflow }) => $overflow};
  border-radius: 12px;
  transition: 400ms;

  .balanceHeader {
    min-height: ${POOL_BALANCES_HEIGHT}px;
    padding: 32px;
    overflow: hidden;
    background-image: ${gradient(6)};
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
      background-image: ${gradient(4)};
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
      ${flexbox('space-between')}
      margin-top: 12px;
      color: rgba(var(--white-rgb), 0.9);

      strong {
        ${textStyle('subtitle', 1)}
      }
    }

    .fiatValue {
      ${flexbox('flex-end')}

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

export const StyledPoolHeader = styled.header`
  .poolName {
    ${textStyle('body', 3)}
    display: inline-block;
    margin-bottom: 12px;
    font-weight: 700;
    background-image: ${gradient(4)};
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    opacity: 0.9;
  }

  .titleGroup {
    ${flexbox('space-between', 'flex-end')}
  }

  .title {
    ${textStyle('header', 4)}
  }

  .tokenList {
    ${flexbox('flex-start')}
    padding-bottom: 8px;
  }

  .tokenItem {
    ${flexbox('flex-start')}
    ${textStyle('body', 3)}
    margin-left: 12px;
    color: var(--gray-400);
    white-space: nowrap;

    &:first-child {
      margin-left: 0;
    }

    .tokenIcon {
      margin-right: 4px;
    }

    .symbol {
      margin-right: 4px;
      font-weight: 700;
    }

    .extLink {
      ${inlineFlexbox()}
      width: 16px;
      height: 16px;
    }
  }
`

export const StyledPoolInformation = styled.section`
  .header {
    ${flexbox('flex-start')}
    width: 100%;
    margin-bottom: 8px;
  }

  .title {
    ${textStyle('body', 3)}
    font-weight: 700;
  }

  .link {
    ${inlineFlexbox('flex-start')}
    ${textStyle('body', 4)}
    margin-left: 8px;
    color: rgba(var(--white-rgb), 0.6);
  }

  .detail {
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
      ${textStyle('body', 3)}
      margin-bottom: 12px;
      font-weight: 700;
      color: rgba(var(--white-rgb), 0.6);
    }

    dd {
      ${textStyle('title')}
      color: var(--white);
      text-align: right;
    }
  }
`

export const StyledPoolModalOverlay = styled(motion.div)<{
  $isSafari?: boolean
}>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(32px);

  ${({ $isSafari }) =>
    $isSafari &&
    css`
      background-color: rgba(0, 0, 0, 0.8);
    `}
`
