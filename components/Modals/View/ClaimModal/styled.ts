import styled, { css } from 'styled-components'

import { flexbox, gradient, textStyle } from 'styles/utils'

import { CompletePage, ModalPage } from 'components/Modals/shared'

export const StyledClaimModalPage1 = styled(ModalPage)`
  .reward {
    ${flexbox()}
    padding: 24px 32px;
    background-image: ${gradient(1)};
    border-radius: 12px;

    dt {
      ${flexbox('start')}
    }

    .tokenIcon {
      margin-right: 8px;
    }

    .countUp {
      ${textStyle('subtitle', 1)}
      color: var(--white);
    }

    .number {
      ${textStyle('body', 3)}
      margin-top: 4px;
      font-weight: 700;
      color: var(--primary-200);
    }

    dt,
    dd {
      flex-grow: 1;
      width: 50%;
    }

    dt {
      ${textStyle('subtitle', 1)}
    }

    dd {
      ${flexbox('center', 'end')}
      flex-direction: column;
      white-space: nowrap;
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
`

export const StyledClaimModalPage2 = styled(CompletePage)`
  .modalContent {
    .detailItem {
      dt {
        ${flexbox('start')}
        color: var(--gray-500);

        .tokenIcon {
          margin-right: 4px;
        }
      }
    }
    button {
      margin-top: 16px;

      &:first-child {
        margin-top: 0;
      }
    }
  }
`
