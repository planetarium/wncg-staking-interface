import styled, { css } from 'styled-components'

import { flexbox, media, textStyle } from 'styles/utils'
import { StyledExitModalPage1Step } from '../styled'

export const StyledExitModalPage1Step2 = styled(StyledExitModalPage1Step)<{
  $isProportional?: boolean
}>`
  .header {
    justify-content: space-between;

    .countUp {
      ${textStyle('body', 2, 700)}
      flex-shrink: 0;
      padding-left: 8px;
    }
  }

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

  .formOutput {
    ${flexbox('center', 'end')}
    flex-direction: column;
    flex-grow: 1;
    flex-shrink: 0;
    padding-left: 16px;

    .amount {
      .value {
        ${textStyle('body', 2)}
        font-weight: 700;
      }
    }

    .fiatValue {
      ${textStyle('body', 4)}
      color: var(--gray-25);
      font-weight: 500 !important ;
    }

    .number,
    .symbol {
      ${textStyle('body', 3)}
      margin-left: 4px;
      font-weight: 700;
    }

    .totalBalance {
      ${textStyle('body', 3)}
      display: inline-block;
      margin-top: 2px;
      color: rgba(var(--gray-25-rgb), 0.5);

      .symbol {
        ${textStyle('body', 4)}
        margin-left: 2px;
      }
    }
  }

  .percent {
    font-weight: 700;
  }

  .propExit {
    margin-top: 20px;
  }

  .singleExit {
    margin-top: 20px;
  }

  ${({ $isProportional }) =>
    $isProportional &&
    css`
      .header {
        align-items: flex-start;
      }
    `}

  ${media(
    'minTablet',
    css`
      .propExit {
        padding: 4px 0;
        margin-top: 0;
      }
    `
  )}
`

export const StyledExitModalPage1Step2ButtonGroup = styled.div`
  ${flexbox('between')}
  padding: 12px 0;

  .ratioButton {
    width: calc(${100 / 4} - ${(12 * 3) / 4}px);
    height: 40px;
    margin-left: 12px;

    &:first-child {
      margin-left: 0;
    }
  }
`

export const StyledExitModalPage1Step2PropAmounts = styled.section`
  .title {
    ${textStyle('body', 3, 700)}
    margin-top: 16px;
  }

  .propAmount {
    margin-top: 8px;
    background-color: rgba(var(--white-rgb), 0.05);
    border-radius: 8px;
  }

  .detailItem {
    padding: 20px 24px;
    margin-top: -16px;

    &:first-child {
      margin-top: 0;
    }

    dt {
      ${flexbox('start')}

      .tokenIcon {
        flex-shrink: 0;
        margin-right: 8px;
      }

      .symbol {
        ${textStyle('body', 2, 700)}
      }

      .parenthesis {
        ${textStyle('body', 3)}
        margin-left: 4px;
        color: var(--gray-500);
      }
    }

    dd {
      ${flexbox('between')}
      margin-top: 6px;

      .amount {
        ${textStyle('body', 3)}
        color: rgba(var(--white-rgb), 0.9);
      }

      .fiatValue {
        ${textStyle('body', 3, 700)}
        color: var(--primary-300);
      }

      .usdAmount {
        ${textStyle('subtitle', 1)}
      }
    }
  }

  ${media(
    'minLaptop',
    css`
      .detailItem {
        ${flexbox('between')}
        padding: 20px 24px;
        margin-top: -${20 * 2 - 16}px;

        &:first-child {
          margin-top: 0;
        }

        dt {
          ${flexbox('start')}

          .tokenIcon {
            flex-shrink: 0;
            margin-right: 8px;
          }

          .symbol {
            ${textStyle('body', 2, 700)}
          }

          .parenthesis {
            ${textStyle('body', 2)}
            margin-left: 8px;
            color: var(--gray-500);
          }
        }

        dd {
          ${flexbox('center', 'end')}
          flex-direction: column;
          text-align: right;

          .amount {
            ${textStyle('body', 2)}
            color: rgba(var(--white-rgb), 0.9);
          }

          .fiatValue {
            ${textStyle('body', 2, 700)}
            margin-top: 2px;
            color: var(--primary-300);
          }

          .usdAmount {
            ${textStyle('subtitle', 1)}
          }
        }
      }
    `
  )}
`
