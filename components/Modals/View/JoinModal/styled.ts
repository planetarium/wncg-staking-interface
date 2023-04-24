import styled, { css } from 'styled-components'

import { CompletePage, ModalPage } from 'components/Modals/shared'
import { media, textStyle } from 'styles/utils'

export const StyledJoinModalPage1 = styled(ModalPage)`
  .usd {
    display: block;
    color: var(--primary-300);
    font-weight: 700;
  }

  .amountGroup {
    ${textStyle('body', 3)}
    margin-top: 8px;
    color: var(--primary-300);

    .number {
      &:first-child::before {
        display: none;
      }

      &::before {
        content: '/';
        margin: 0 0.25em;
      }
    }

    .symbol {
      margin-left: 0.2em;
    }
  }

  ${media(
    'minLaptop',
    css`
      .amountGroup {
        ${textStyle('body', 2)}
      }
    `
  )}
`

export const StyledJoinModalPage2 = styled(CompletePage)`
  .detailItem {
    &.total {
      dd {
        .countUp {
          font-weight: 700;
          color: var(--gray-700);
        }

        .fiatValue {
          ${textStyle('body', 3)}
        }
      }
    }

    &.accent {
      dd,
      .number,
      .fiatValue {
        color: var(--primary-500) !important;
      }
    }

    dt {
      flex-shrink: 0;
      color: var(--gray-500);
      white-space: nowrap;
    }

    dd {
      ${textStyle('body', 3)}
      color: var(--gray-700);

      .number {
        font-weight: 700;
        color: var(--gray-700);
      }

      .fiatValue {
        display: block;
        color: var(--gray-500);

        .number {
          font-weight: 500;
          color: var(--gray-500);
        }
      }
    }
  }
`
