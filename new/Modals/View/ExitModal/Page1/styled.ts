import styled, { css } from 'styled-components'

import { buttonStyle } from 'new/Button/styled'
import { flexbox, textStyle } from 'newStyles/utils'

import { StyledModalContent } from 'new/Modals/shared/styled'

export const StyledExitModalPage1 = styled(StyledModalContent)`
  max-width: 720px;
`

export const StyledExitModalPage1Footer = styled.footer`
  margin-top: 64px;

  .checkout {
    ${flexbox('space-between')}
    width: 100%;
    margin-bottom: 24px;

    .text,
    .value {
      width: calc(50% - 4px);
    }

    .text {
      ${textStyle('body', 3)}
      text-align: right;
    }

    .value {
      ${flexbox('flex-start')}
      ${textStyle('title')}
      transition: 150ms;

      &.enabled {
        color: var(--primary-300);
      }
    }
  }
`

export const StyledExitModalPage1Header = styled.header`
  position: relative;

  .slippageDropdown {
    margin-top: 8px;
  }
`

const StyledExitModalPage1Step = styled.div<{ $disabled?: boolean }>`
  margin-top: 64px;
  transition: 200ms;

  &:first-child {
    margin-top: 0;
  }

  .header {
    ${flexbox('flex-start')}

    .count {
      ${flexbox()}
      ${textStyle('body', 3)}
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      margin-right: 12px;
      font-weight: 700;
      border-radius: 50%;
      background-color: rgba(var(--white-rgb), 0.1);
    }

    .title {
      ${textStyle('subtitle', 1)}
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
    ${flexbox('space-between')}
    width: 100%;
    margin-top: 20px;
  }

  .tokenButton {
    position: relative;
    width: calc(25% - 9px);
    overflow: hidden;
    color: rgba(var(--white-rgb), 0.6);
    border-radius: 6px;
    background-color: rgba(var(--white-rgb), 0.05);
    transition: 150ms;

    &.selected {
      color: var(--white);
      background-color: var(--primary-500);
    }

    .fakeInput {
      ${buttonStyle}
      ${textStyle('body', 2)}
      width: 100%;
      justify-content: flex-start;
      padding: 16px;
      font-weight: 700;
    }

    .label {
      ${flexbox('flex-start')}
      margin-left: 12px;
      white-space: nowrap;
      text-align: left;
      pointer-events: none;
    }

    input {
      position: absolute;
      top: 0;
      left: 0;

      opacity: 0;
      visibility: hidden;
    }
  }
`

export const StyledExitModalPage1Step2 = styled(StyledExitModalPage1Step)`
  .header {
    .pcnt {
      ${textStyle('subtitle', 1)}
      flex-shrink: 0;
      padding-left: 8px;
    }
  }

  .singleExit {
    margin-top: 20px;
  }

  .propExit {
    margin-top: 22px;
  }

  .propAmounts {
    margin-top: 30px;
  }
`

export const StyledExitModalPage1Step2PropAmounts = styled.dl`
  background-color: rgba(var(--white-rgb), 0.05);
  border-radius: 8px;

  .detailItem {
    ${flexbox('space-between')}
    padding: 32px;

    dt {
      ${flexbox('flex-start')}

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
      ${flexbox('center', 'flex-end')}
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
    ${textStyle('subtitle', 1)}
  }

  .highPriceImpact,
  .rektPriceImpact {
    margin-top: 20px;
  }
`
