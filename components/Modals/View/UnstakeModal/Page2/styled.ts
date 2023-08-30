import styled, { css } from 'styled-components'

import { media, posCenterY, textStyle } from 'styles/utils'
import { ModalPage } from 'components/Modals/shared'

export const StyledUnstakeModalPage2 = styled(ModalPage)`
  ${({ $disabled }) =>
    $disabled &&
    css`
      .modalContent,
      .modalFooter {
        opacity: 0.5;
      }
    `}
`

export const StyledUnstakeModalPage2Form = styled.form`
  .maxButton {
    right: 8px;
  }

  .input {
    padding-right: ${54 + 8 * 2}px;
  }

  .claimCheckbox {
    position: relative;
    padding: 20px;
    margin-top: 24px;
    background-color: rgba(var(--white-rgb), 0.05);
    border-radius: 8px;

    &.disabled {
      opacity: 0.5;
    }

    .label,
    .desc {
      padding-right: ${32 + 20}px;
    }

    .label {
      ${textStyle('body', 3, 700)}
      color: var(--white);
    }

    .desc {
      ${textStyle('body', 3)}
      margin-top: 8px;
      color: var(--gray-400);
    }

    .checkbox {
      ${posCenterY()}
      right: 20px;

      .icon.check {
        color: var(--primary-400);
      }
    }
  }

  ${media(
    'minSmLaptop',
    css`
      .maxButton {
        right: 16px;
      }

      .input {
        padding-right: ${80 + 16 + 8}px;
      }

      .claimCheckbox {
        padding: 24px 32px;
        margin-top: 40px;

        .label {
          ${textStyle('body', 2, 700)}
        }

        .desc {
          ${textStyle('body', 3)}
          margin-top: 4px;
          color: var(--gray-500);
        }

        .checkbox {
          right: 32px;
        }
      }
    `
  )}
`
