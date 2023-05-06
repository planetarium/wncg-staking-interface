import styled, { css } from 'styled-components'

import { flexbox, media, textStyle } from 'styles/utils'

import { StyledModalApprovePage } from '../../shared/styled'
import { CompletePage } from 'components/Modals/shared'

export const StyledApproveModalPage1 = styled(StyledModalApprovePage)`
  .guide {
    ${textStyle('body', 4)}
    padding: 16px;
    margin-top: 16px;
    color: var(--gray-300);
    background-color: var(--gray-700);
    border-radius: 8px;

    &:first-child {
      margin-top: 0;
    }
  }

  .guideTitle {
    ${textStyle('body', 4, 700)}
    margin-top: 8px;
    color: var(--gray-25);
  }

  .walletGroup {
    .connectorIcon {
      margin-left: 6px;
      background-color: transparent;

      &:first-child {
        margin-left: 0;
      }
    }

    .cryptoIcon {
      width: 102%;
      height: 102%;
    }
  }

  ol {
    padding-left: 16px;
    margin-top: 12px;
    list-style: decimal;
  }

  ul {
    padding-left: 16px;
    list-style: disc;
  }
`

export const StyledApprovalModalPage2 = styled(CompletePage)`
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

  ${media(
    'minSmLaptop',
    css`
      .modalHeader {
        + .modalFooter {
          margin-top: 48px !important;
        }
      }
    `
  )}
`
