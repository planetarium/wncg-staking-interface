import { motion } from 'framer-motion'
import styled from 'styled-components'

import { flexbox, textStyle } from 'styles/utils'

const POOL_BALANCES_HEIGHT = 236
const POOL_BALANCES_COLLAPSE_BUTTON_HEIGHT = 50

export const StyledPoolBalances = styled(motion.section)`
  position: sticky;
  top: 0;
  border-radius: 12px;
  overflow: hidden;

  .balancesHeader {
    padding: 32px;
    overflow: hidden;
    background-image: linear-gradient(
      114.26deg,
      #1e1c28 26.02%,
      #20282b 40.51%,
      #22262e 69.5%
    );
    background-color: var(--gray-900);

    .token {
      ${flexbox()}

      .tokenIcon {
        margin-left: -20px;

        &:first-child {
          margin-left: 0;
        }
      }
    }

    .title {
      ${textStyle('body', 3)}
      width: min-content;
      margin: 12px auto 0;
      font-weight: 700;
      color: rgba(var(--gray-25-rgb), 0.9);
      text-align: center;
      white-space: nowrap;
    }
  }

  .connectButton {
    margin-top: 32px;
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
      ${textStyle('subtitle', 1)}
      margin-top: 12px;
      color: rgba(var(--white-rgb), 0.9);
    }

    .desc {
      ${textStyle('body', 2)}
      color: rgba(var(--white-rgb), 0.5);
    }
  }
`

export const StyledPoolBalancesHeader = styled.header`
  min-height: ${POOL_BALANCES_HEIGHT}px;
`

export const StyledPoolBalancesContent = styled.div`
  padding: 32px;
  padding-bottom: ${POOL_BALANCES_COLLAPSE_BUTTON_HEIGHT}px;
  background-color: var(--white);

  .header {
    .amount,
    .placeholder {
      ${flexbox('start')}
      ${textStyle('title', 1)}
      margin-top: 4px;
      color: var(--black);
      white-space: nowrap;

      .countUp {
        ${textStyle('title', 1)}
        color: var(--black);
      }

      .number {
        ${textStyle('body', 2)}
        color: var(--gray-500);
        margin-left: 4px;
      }
    }
  }

  .title {
    ${textStyle('body', 2)}
    font-weight: 700;
    color: var(--gray-500);
  }

  .divider {
    display: block;
    margin: 32px 0;
    border: 1px solid var(--gray-200);
    border-radius: 10px;
  }

  .poolTokens {
    margin-top: ${24 - 4}px;
  }

  .connectButton {
    ${textStyle('body', 1)}
    margin-top: 4px;
    color: var(--gray-400);
  }
`
