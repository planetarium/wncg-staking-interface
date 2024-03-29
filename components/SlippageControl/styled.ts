import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { flexbox, inlineFlexbox, media, textStyle } from 'styles/utils'

const SLIPPAGE_TOGGLE_LABEL_WIDTH_MOBILE = 135
const SLIPPAGE_TOGGLE_LABEL_WIDTH_SM_LAPTOP = 145
const SLIPPAGE_INPUT_PADDING = 12
const SLIPPAGE_MENU_WIDTH = 144

export const StyledSlippageControl = styled.div<{ $open: boolean }>`
  position: relative;
  z-index: 1;

  .tooltip {
    pointer-events: none;
  }
`

export const StyledSlippageControlInput = styled.div<{
  $active: boolean
  $error: boolean
}>`
  ${flexbox('between')}
  position: relative;
  padding-right: 8px;
  margin-top: 2px;

  .input {
    ${textStyle('body', 2)}
    position: relative;
    z-index: 1;
    width: 88px;
    height: 40px;
    padding: 8px ${SLIPPAGE_INPUT_PADDING}px;
    font-weight: 500;
    color: var(--gray-600);
    border: 1.5px solid var(--gray-300);
    border-radius: 4px;
    transition: 200ms;
    background-color: var(--white);

    &::placeholder {
      font-weight: 500;
      color: var(--gray-300);
    }

    &:focus {
      border-color: var(--gray-500);
    }

    &:has(input:disabled),
    &:has(button:disabled) {
      border-color: rgba(var(--white-rgb), 0.4);
    }
  }

  .errorMsg {
    ${flexbox('start')}
    ${textStyle('caption')}
    margin-top: 4px;
    white-space: nowrap;
    color: var(--error-500);

    .icon {
      width: 12px;
      height: 12px;
      margin-left: 0;
      margin-right: 4px;
      color: var(--error-500);

      svg {
        width: 12px;
        height: 12px;
      }
    }
  }

  .icon {
    &.check {
      position: absolute;
      top: ${(40 - 16) / 2}px;
      right: 4px;
      transition: 200ms;
      color: var(--gray-900);
      opacity: 0;
    }
  }

  ${({ $active }) =>
    $active &&
    css`
      .input {
        &:not(:focus) {
          font-weight: 700;
          color: var(--gray-900);
        }
      }

      .icon {
        &.check {
          opacity: 1;
        }
      }
    `}

  ${({ $error }) =>
    $error &&
    css`
      .input {
        border-color: var(--error-500) !important;
      }
    `}
`

export const StyledSlippageControlMenu = styled(motion.ul)`
  position: absolute;
  top: calc(100% + 4px);
  left: ${SLIPPAGE_TOGGLE_LABEL_WIDTH_MOBILE + 4}px;
  width: ${SLIPPAGE_MENU_WIDTH}px;
  padding: 8px;
  overflow: hidden;
  background-color: var(--white);
  border-radius: 8px;
  list-style: none;

  .menuItem {
    position: relative;
    width: 100%;
    margin-top: 2px;

    &.selected {
      .number {
        font-weight: 700;
        color: var(--gray-900);
      }

      .icon {
        color: var(--gray-900);
      }
    }

    &:first-child {
      margin-top: 0;
    }

    button {
      ${flexbox('start')}
      width: 100%;
      height: 40px;
      padding: 8px 8px 8px 12px;
      white-space: nowrap;
      text-align: left;
      border-radius: 4px;
      transition: 150ms;

      &:hover {
        background-color: var(--gray-100);
      }
    }

    .number {
      ${inlineFlexbox('start')}
      ${textStyle('body', 2)}
      flex-grow: 1;
      font-weight: inherit;
      color: var(--gray-500);
    }

    .icon {
      flex-shrink: 0;
      margin-left: 4px;
      transition: 200ms;
      color: transparent;
    }
  }

  ${media(
    'minSmLaptop',
    css`
      left: ${SLIPPAGE_TOGGLE_LABEL_WIDTH_SM_LAPTOP + 4}px;
    `
  )}
`

export const StyledSlippageControlToggle = styled.div<{ $disabled: boolean }>`
  ${flexbox('start')}
  ${textStyle('body', 4)}
  color: rgba(var(--white-rgb), 0.6);
  text-align: left;
  white-space: nowrap;
  transition: 200ms;

  .label {
    ${flexbox('start')}
    width: ${SLIPPAGE_TOGGLE_LABEL_WIDTH_MOBILE}px;
  }

  .tooltipGroup {
    .toggler {
      margin-left: 4px;
    }

    .tooltip {
      left: 0;
      transform: none;
    }
  }

  .toggleButton {
    ${inlineFlexbox()}
    ${textStyle('body', 3)}
    padding: 4px;
    margin-left: 4px;
    color: var(--white);

    .number {
      font-weight: 700;
    }
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;

      * {
        cursor: not-allowed;
      }
    `}

  ${media(
    'minSmLaptop',
    css`
      ${textStyle('body', 3)}

      .label {
        width: ${SLIPPAGE_TOGGLE_LABEL_WIDTH_SM_LAPTOP}px;
      }
    `
  )}
`
