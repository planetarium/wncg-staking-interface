import styled from 'styled-components'

import { ModalPage } from 'new/Modals/shared'
import { ModalCompletePage } from 'new/Modals/shared'
import { flexbox, gradient, textStyle } from 'newStyles/utils'

export const StyledJoinModalPage3 = styled(ModalPage)`
  .subtitle {
    .amount,
    .amounts {
      display: block;
      color: var(--primary-300);
    }

    .usdValue {
      margin-left: 0.25em;
    }
  }

  .desc {
    span {
      &:last-child::after {
        display: none;
      }

      &::after {
        content: '/';
        margin: 0 4px;
      }
    }
  }
`

export const StyledJoinModalPage4 = styled(ModalCompletePage)`
  .details {
    width: 100%;
    padding: 20px 24px;
    margin-bottom: 48px;
    overflow: hidden;
    background-image: ${gradient(1)};
    border-radius: 6px;
  }

  .detailItem {
    ${flexbox('space-between', 'flex-start')}

    &.total {
      padding-top: 12px;
      margin-top: 12px;
      border-top: 1.5px solid rgba(var(--white-rgb), 0.2);

      dd {
        ${textStyle('subtitle', 1)}
      }
    }

    .usd {
      color: var(--white);
      font-weight: 700;
    }

    dt {
      ${textStyle('body', 3)}
      font-weight: 700;
      white-space: nowrap;
    }

    dd {
      ${flexbox('flex-end')}
      ${textStyle('body', 3)}
      font-weight: 500;
      color: var(--primary-200);
    }
  }
`
