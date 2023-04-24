import styled, { css } from 'styled-components'

import { media, textStyle } from 'styles/utils'

import { CompletePage, ModalPage } from 'components/Modals/shared'

export const StyledStakeModalPage0 = styled(ModalPage)`
  max-width: 480px;

  ${media(
    'minSmLaptop',
    css`
      .modalHeader {
        padding-right: ${48}px !important;
      }
    `
  )}
`

export const StyledStakeModalPage1 = styled(ModalPage)`
  .modalHeader {
    .titleGroup {
      white-space: nowrap;
    }
  }

  .subtitle {
    .number,
    .symbol,
    .parenthesis {
      color: var(--primary-300);
      font-weight: 700;
    }

    .symbol {
      margin-left: 4px;
    }

    .parenthesis {
      margin-left: 8px;
    }
  }

  .amount {
    display: block;
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      .modalContent,
      .modalFooter {
        opacity: 0.5;
      }
    `}
`

export const StyledStakeModalPage2 = styled(CompletePage)`
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
