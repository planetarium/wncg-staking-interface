import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { flexbox, gradient, posCenterY, textStyle } from 'newStyles/utils'

const MAX_BUTTON_WIDTH = 80
const MAX_BUTTON_HEIGHT = 48

export type InputSize = 'sm' | 'md'

const smInputStyle = css`
  height: 64px;

  .input {
    padding: 8px 24px;
    padding-right: ${MAX_BUTTON_WIDTH + 8 * 2}px;
  }

  .maxButton {
    right: 8px;
  }
`

const mdInputStyle = css`
  height: 80px;

  .input {
    padding: 16px 32px;
    padding-right: ${MAX_BUTTON_WIDTH + 16 + 8}px;
  }

  .maxButton {
    right: 16px;
  }
`

export const StyledAvailableTokenAmount = styled(motion.dl)`
  ${flexbox('flex-start')}
  ${textStyle('body', 2)}
  margin-top: 8px;
  color: var(--primary-300);

  &:has(dd) {
    dt::after {
      margin-right: 4px;
      margin-left: 4px;
      content: ':';
    }
  }

  dd {
    ${flexbox('flex-start')}
  }

  .usd {
    margin-left: 4px;
  }
`

type StyledBaseInputProps = {
  $disabled: boolean
  $error: boolean
  $size: InputSize
}

export const StyledBaseInput = styled.div<StyledBaseInputProps>`
  position: relative;
  width: 100%;
  border: 1.5px solid;
  border-color: rgba(var(--white-rgb), 0.8);
  border-radius: 8px;
  transition: 200ms;

  &:has(input:focus),
  &:has(button:focus) {
    border-color: var(--white);
  }

  .input {
    ${textStyle('body', 1)}
    width: 100%;
    height: 100%;
    font-weight: 700;
    color: var(--white);

    &:disabled {
      &::placeholder {
        color: rgba(var(--white-rgb), 0.5);
      }
    }

    &::placeholder {
      font-weight: 500;
      color: rgba(var(--white-rgb), 0.5);
    }
  }

  .maxButton {
    ${posCenterY()}
    ${textStyle('body', 1)}
    flex-shrink: 0;
    width: ${MAX_BUTTON_WIDTH}px;
    height: ${MAX_BUTTON_HEIGHT}px;
    color: var(--white);
    background-color: rgba(var(--white-rgb), 0.1);
    border-radius: 4px;

    &:disabled {
      color: rgba(var(--white-rgb), 0.4);
      cursor: not-allowed;
    }
  }

  ${({ $size }) => $size === 'sm' && smInputStyle}
  ${({ $size }) => $size === 'md' && mdInputStyle}

  ${({ $disabled }) =>
    $disabled &&
    css`
      border-color: rgba(var(--white-rgb), 0.4);
    `}

  ${({ $error }) =>
    $error &&
    css`
      border-color: var(--error-600) !important;
    `}
`

export const StyledErrorMessage = styled(motion.p)`
  ${textStyle('body', 2)}
  margin-top: 8px;
  color: var(--error-600);
`

export const StyledInputControl = styled.div`
  position: relative;
  width: 100%;

  &:has(.errorMsg) {
    & + .availableTokenAmount {
      margin-top: 0;
    }
  }
`

export const StyledRangeInput = styled.div<{ $disabled: boolean }>`
  .input {
    appearance: none;
    margin-right: 15px;
    width: 100%;
    height: 8px;
    cursor: pointer;
    background-color: rgba(var(--white-rgb), 0.05);
    background-image: linear-gradient(
      to right,
      var(--primary-500),
      var(--primary-500)
    );
    background-repeat: no-repeat;
    border-radius: 10px;
    box-shadow: 0 0 0 1px inset rgba(var(--white-rgb), 0.05);

    &::-webkit-slider-thumb {
      appearance: none;
      height: 28px;
      width: 28px;
      background-color: var(--primary-500);
      background-image: ${gradient(2)};
      border-radius: 50%;
      box-shadow: 0 0 0 2px rgba(var(--black-rgb), 0.2),
        0 8px 20px 0 rgba(var(--black-rgb), 0.17);
      transition: 100ms;
    }

    &::-webkit-slider-runnable-track {
      appearance: none;
      border: none;
      box-shadow: none;
    }

    &:focus {
      outline: none;
    }
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      background-color: rgba(0, 0, 0, 1);
    `}
`
