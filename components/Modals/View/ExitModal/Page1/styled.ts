import styled, { css } from 'styled-components'

import { buttonStyle } from 'components/Button/styled'
import { flexbox, gradient, media, textStyle } from 'styles/utils'
import { ModalPage } from 'components/Modals/shared'

export const StyledExitModalPage1 = styled(ModalPage)<{ $disabled: boolean }>`
  .tokenIcon {
    .icon {
      box-shadow: 1px 1px 4px rgba(var(--realBlack-rgb), 0.24);
    }
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      .modalHeader,
      .modalContent,
      .modalFooter {
        opacity: 0.5;
      }
    `}
`

export const StyledExitModalPage1Header = styled.header`
  position: relative;

  .slippageControl {
    margin-top: 12px;

    .tooltip {
      width: calc(100vw - ${24 * 2}px);
      white-space: initial;
    }
  }

  ${media(
    'minTablet',
    css`
      .slippageControl {
        .tooltip {
          width: max-content;
        }
      }
    `
  )}

  ${media(
    'minSmLaptop',
    css`
      .slippageControl {
        margin-top: 8px;
      }
    `
  )}
`

export const StyledExitModalPage1Step = styled.div<{ $disabled?: boolean }>`
  margin-top: 48px;
  transition: 200ms;

  &:first-child {
    margin-top: 0;
  }

  .header {
    ${flexbox('start')}

    .count {
      ${flexbox()}
      ${textStyle('body', 3)}
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      margin-right: 12px;
      font-weight: 700;
      border-radius: 50%;
      background-color: rgba(var(--white-rgb), 0.1);
    }

    .title {
      ${textStyle('body', 2, 700)}
      flex-grow: 1;
      color: rgba(var(--white-rgb), 0.9);
    }
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
    `}
`

export const StyledExitModalPage1Step1 = styled(StyledExitModalPage1Step)`
  .tokenGroup {
    ${flexbox('between')}
    flex-wrap: wrap;
    width: 100%;
    margin-top: 20px;
  }

  .tokenButton {
    position: relative;
    width: calc(50% - ${12 / 2}px);
    margin-top: 12px;
    overflow: hidden;
    color: rgba(var(--white-rgb), 0.6);
    border-radius: 6px;
    background-color: rgba(var(--white-rgb), 0.05);
    transition: 150ms;

    &.disabled {
      input {
        cursor: not-allowed;
      }
    }

    &.selected {
      color: var(--white);
      background-color: var(--primary-500);

      &::before {
        opacity: 0 !important;
      }
    }

    &:nth-child(1),
    &:nth-child(2) {
      margin-top: 0;
    }

    .fakeInput {
      ${buttonStyle}
      ${textStyle('body', 3, 700)}
      width: 100%;
      justify-content: flex-start;
      padding: 12px;

      .label {
        ${flexbox('start')}
        margin-left: 12px;
        white-space: nowrap;
        text-align: left;
        pointer-events: none;
      }
    }

    .tokenIcon {
      ${flexbox('start')}
    }

    .tokenFragment {
      box-shadow: 1px 1px 4px rgba(var(--realBlack-rgb), 0.24);
    }

    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }

  ${media(
    'minTablet',
    css`
      .tokenButton {
        position: relative;
        overflow: hidden;

        &::before {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          content: '';
          background-image: ${gradient(6)};
          transition: 250ms;
        }

        &:not(.disabled) {
          &:hover {
            &::before {
              opacity: 1;
            }
          }
        }
      }

      input {
        cursor: pointer;
      }
    `
  )}
`

export const StyledExitModalPage1Step2 = styled(StyledExitModalPage1Step)`
  .header {
    align-items: flex-start;

    .countUp {
      ${textStyle('subtitle', 1)}
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

  .propTitle {
    ${textStyle('body', 3, 700)}
    margin-top: 16px;
  }

  .singleExit {
    margin-top: 20px;
  }

  .propExit {
    margin-top: 20px;
  }
`

export const StyledExitModalPage1Step2PropAmounts = styled.dl`
  margin-top: 16px;
  background-color: rgba(var(--white-rgb), 0.05);
  border-radius: 8px;

  .detailItem {
    ${flexbox('between')}
    padding: 32px;

    dt {
      ${flexbox('start')}

      .tokenIcon {
        flex-shrink: 0;
        margin-right: 12px;
      }

      .symbol {
        ${textStyle('subtitle', 1)}
      }

      .pcnt {
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
        margin-top: 4px;
        color: var(--primary-300);
      }

      .usdAmount {
        ${textStyle('subtitle', 1)}
      }
    }
  }
`

export const StyledExitModalPage1Step3 = styled(StyledExitModalPage1Step)`
  .pcnt {
    ${textStyle('body', 2, 700)}

    &.alert {
      color: var(--error-400);
    }
  }

  .highPriceImpact,
  .rektPriceImpact {
    margin-top: 20px;
  }

  ${media(
    'minLaptop',
    css`
      .pcnt {
        ${textStyle('subtitle', 1)}
      }
    `
  )}
`
