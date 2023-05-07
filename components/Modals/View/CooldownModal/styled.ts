import styled from 'styled-components'

import { flexbox, textStyle } from 'styles/utils'

import { ModalPage } from 'components/Modals/shared'
import { StyledModalCompletePage } from 'components/Modals/shared/styled'

export const StyledCooldownModalPage1 = styled(ModalPage)`
  .modalHeader {
    .title {
      ${flexbox('start')}

      .icon {
        margin-right: 4px;
      }
    }
  }

  .revenueList {
    margin-top: -16px;
    margin-bottom: -16px;
  }
`

export const StyledCooldownModalPage3 = styled(StyledModalCompletePage)`
  .lottieContainer {
    ${flexbox()}
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    background-color: var(--primary-500);
    border-radius: 80px;

    .lottie {
      width: 80px;
      height: 80px;
      margin: 0 !important;

      > div {
        width: 80px;
        height: 80px;
      }
    }
  }

  .scheduleList {
    width: 100%;
    padding: 0;
    background-color: transparent;
  }

  .scheduleItem {
    ${flexbox('between')}
    ${textStyle('body', 3)}
    flex-wrap: wrap;
    padding: 16px 24px;
    margin-top: 16px;
    background-color: rgba(var(--white-rgb), 0.05);
    border-radius: 8px;

    &:first-child {
      margin-top: 0;
    }

    dt {
      max-width: 80px;
      margin: 0;
      font-weight: 700;
      color: var(--primary-300);
    }

    dd {
      ${textStyle('body', 3)}
      flex-grow: 1;
      margin: 0;
      text-align: right;
      color: rgba(var(--white-rgb), 0.9);

      &.misc {
        width: 100%;
        margin-top: 16px;
        color: rgba(var(--gray-100-rgb), 0.9);
        text-align: left;
        word-break: unset;

        &::before {
          margin-right: 2px;
          content: '*';
        }
      }

      time {
        font-weight: 700;
      }
    }
  }
`
