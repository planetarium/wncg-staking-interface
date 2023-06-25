import styled, { css } from 'styled-components'

import { ModalPage } from 'components/Modals/shared'
import { flexbox, textStyle } from 'styles/utils'

export const StyledRemoveLiquidityModalPage1 = styled(ModalPage)`
  max-width: 640px;

  .formLabel {
    ${flexbox('start')}

    .count {
      ${flexbox()}
      ${textStyle('body', 3)}
      width: 24px;
      height: 24px;
      margin-right: 8px;
      font-weight: 700;
      border-radius: 24px;
      background-color: rgba(var(--white-rgb), 0.1);
    }

    .label {
      ${textStyle('body', 2)}
      font-weight: 700;
      color: rgba(var(--white-rgb), 0.9);
    }
  }

  .timer {
    ${textStyle('body', 4)}
    margin-top: 16px;
    text-align: center;

    strong {
      color: var(--primary-200);
      font-weight: 500;
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

export const StyledRemoveLiquidityModalPage1Signature = styled.div`
  ${flexbox('between')}
  margin-top: 48px;

  .signButton {
    width: 160px;
  }
`
