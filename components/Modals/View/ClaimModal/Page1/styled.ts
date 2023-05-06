import styled, { css } from 'styled-components'

import { flexbox, gradient, media, textStyle } from 'styles/utils'

import { ModalPage } from 'components/Modals/shared'

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

export const StyledClaimModalPage1Form = styled.form`
  .rewardGroup {
    ${flexbox('start', 'start')}
    flex-direction: column;
    width: 100%;
  }

  .rewardCard {
    ${flexbox('start', 'start')}
    flex-direction: column;
    position: relative;
    width: 100%;
    padding: 24px;
    margin-top: 20px;
    background-color: rgba(var(--white-rgb), 0.05);
    border-radius: 8px;
    border: 1px solid var(--gray-400);
    transition: 200ms;
    cursor: pointer;

    &.selected {
      border-color: var(--primary-400);
    }

    &:first-child {
      margin-top: 0;
    }

    &.disabled {
      opacity: 0.5 !important;
    }

    .iconContainer {
      ${flexbox()}
      position: absolute;
      right: 24px;
      width: 24px;
      height: 24px;
      color: var(--primary-400);
      pointer-events: none;

      svg {
        width: 26px;
        height: 26px;
      }
    }

    .tokenName {
      ${flexbox('start')}
      pointer-events: none;

      .tokenIcon {
        flex-shrink: 0;
        margin-right: 4px;
      }

      strong {
        ${textStyle('body', 2, 700)}
      }
    }

    .amount {
      ${textStyle('body', 3, 700)}
      display: block;
      flex-grow: 1;
      margin-top: 8px;
      pointer-events: none;
    }

    .fiatValue {
      ${textStyle('subtitle', 1)}
      justify-content: flex-end;
      width: 100%;
      margin-top: 20px;
      text-align: right;
      pointer-events: none;
    }

    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;

      &:disabled {
        cursor: not-allowed;
      }
    }
  }

  ${media(
    'minSmLaptop',
    css`
      .rewardGroup {
        flex-direction: row;
        justify-content: space-between;
      }

      .rewardCard {
        width: calc(50% - ${16 / 2}px);
        margin-top: 0 !important;

        .tokenName {
          .tokenIcon {
            margin-right: 8px;
          }

          strong {
            ${textStyle('subtitle', 2)}
          }
        }

        .amount {
          ${textStyle('body', 2)}
        }

        .fiatValue {
          margin-top: 24px;
        }
      }
    `
  )}
`
