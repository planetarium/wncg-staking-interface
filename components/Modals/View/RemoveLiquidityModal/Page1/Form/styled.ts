import styled from 'styled-components'

import { flexbox, textStyle } from 'styles/utils'

export const StyledRemoveLiquidityModalPage1Form = styled.div`
  .formHeader {
    ${flexbox('between', 'start')}
    white-space: nowrap;
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

  .inputControl {
    margin-top: 4px;
  }
`

export const StyledRemoveLiquidityModalPage1FormButtonGroup = styled.div`
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

export const StyledRemoveLiquidityModalPageFormSummary = styled.div`
  margin-top: 16px;

  .title {
    ${textStyle('body', 3)}
    ${flexbox('between')}
    font-weight: 700;
  }

  .content {
    padding: 20px 24px;
    margin-top: 4px;
    background-color: rgba(var(--white-rgb), 0.1);
    border-radius: 8px;
  }

  .checkGroup {
    ${flexbox('start')}
    margin: 8px 0;
    color: var(--primary-200);

    .checkbox {
      margin-right: 8px;
    }

    .text {
      ${textStyle('body', 3, 700)}
    }
  }

  .formSummaryItem {
    ${flexbox('between')}
    margin-top: 16px;

    &:first-child {
      margin-top: 0;
    }

    dt {
      ${flexbox('start')}
      ${textStyle('body', 2)}
    font-weight: 700;

      .tokenIcon {
        margin-right: 8px;
      }

      .parenthesis {
        margin-left: 8px;
        color: var(--gray-500);
        font-weight: 500;
      }
    }

    dd {
      ${flexbox('center', 'end')}
      flex-direction: column;

      .number {
        ${textStyle('body', 2)}
        color: rgba(var(--white-rgb), 0.9);
      }

      .countUp {
        ${textStyle('body', 2)}
        margin-top: 2px;
        font-weight: 700;
        color: var(--primary-300);
      }
    }
  }

  .divider {
    display: block;
    width: 100%;
    height: 1px;
    margin: 16px 0;
    background-color: rgba(var(--white-rgb), 0.1);
  }

  .currentPrice {
    color: rgba(var(--gray-25-rgb), 0.5);

    dt,
    dd {
      ${textStyle('body', 3)}
    }

    dd {
      ${flexbox('start')}
      margin-top: 4px;
    }

    .price {
      margin-left: 16px;

      &:first-child {
        margin-left: 0;
      }
    }

    .number {
      display: inline-block;
      color: inherit;
    }

    .symbol {
      ${textStyle('caption')}
      margin-left: 0.25em;
    }
  }
`
