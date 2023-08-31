import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import {
  flexbox,
  gradient,
  inlineFlexbox,
  media,
  posCenterY,
  textStyle,
} from 'styles/utils'

const MAX_BUTTON_WIDTH_MOBILE = 54
const MAX_BUTTON_HEIGHT_MOBILE = 36
const MAX_BUTTON_WIDTH_TABLET = 80
const MAX_BUTTON_HEIGHT_TABLET = 48

const INPUT_HEIGHT_SM = 64
const INPUT_HEIGHT_MD = 72
const INPUT_HEIGHT_LG = 80

export type InputSize = 'sm' | 'md' | 'lg'

type StyledFormCommonProps = {
  $disabled?: boolean
}

export const StyledAvailableBalance = styled(motion.dl)<{
  $disabled?: boolean
  $size: InputSize
}>`
  ${inlineFlexbox('start')}
  ${textStyle('body', 3)}
  flex-wrap: wrap;
  margin-top: 8px;
  color: var(--primary-300);
  transition: 200ms;

  dt::after {
    margin-right: 4px;
    margin-left: 4px;
    content: ':';
  }

  dd {
    ${flexbox('start')}
  }

  .number {
    .symbol {
      margin-left: 0.2em;
    }
  }

  .parenthesis {
    margin-left: 4px;
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5 !important;
    `}
`

export const smInputStyle = css`
  height: ${INPUT_HEIGHT_SM}px;

  .input,
  .value {
    padding: 8px 16px;
  }

  .tooltip {
    left: 16px;
  }
`

export const mdInputStyle = css`
  height: ${INPUT_HEIGHT_MD}px;

  .input,
  .value {
    padding: 16px 24px;
    padding-right: ${MAX_BUTTON_WIDTH_TABLET + 16 + 12}px;
  }

  .maxButton {
    right: 12px;
  }

  .tooltip {
    left: 24px;
  }
`

export const lgInputStyle = css`
  height: ${INPUT_HEIGHT_LG}px;

  .input,
  .value {
    ${textStyle('body', 1)}
    padding: 16px 32px;
    padding-right: ${MAX_BUTTON_WIDTH_TABLET + 16 + 16}px;
  }

  .maxButton {
    right: 16px;
  }

  .tooltip {
    left: 32px;
  }
`

type StyledBaseInputProps = {
  $disabled: boolean
  $error: boolean
  $size: InputSize
  $text?: boolean
}

export const StyledBaseInput = styled.div<StyledBaseInputProps>`
  position: relative;
  width: 100%;
  height: 64px;
  border: 1.5px solid;
  border-color: rgba(var(--white-rgb), 0.8);
  border-radius: 8px;
  transition: 200ms;

  &:has(input:focus),
  &:has(button:focus) {
    border-color: var(--white);
  }

  &:has(input:disabled),
  &:has(button:disabled) {
    border-color: rgba(var(--white-rgb), 0.4);
  }

  .value {
    ${posCenterY()}
    ${textStyle('body', 2, 700)}
    color: var(--white);
  }

  .input {
    ${textStyle('body', 2, 700)}
    width: 100%;
    height: 100%;
    padding: 8px 16px;
    color: var(--white);

    &:disabled {
      color: rgba(var(--white-rgb), 0.5);

      &::placeholder {
        color: rgba(var(--white-rgb), 0.5);
      }
    }

    &::placeholder {
      font-weight: 500;
      color: rgba(var(--white-rgb), 0.5);
    }
  }

  .tooltip {
    left: 16px;
  }

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

  ${({ $text }) =>
    $text &&
    css`
      .input {
        padding-right: 32px !important;
      }
    `}

  ${({ $size }) =>
    $size === 'sm' &&
    css`
      ${media(
        'minTablet',
        css`
          ${smInputStyle}
        `
      )}
    `}

  ${({ $size }) =>
    $size === 'md' &&
    css`
      ${media(
        'minTablet',
        css`
          ${mdInputStyle}
        `
      )}
    `}

  ${({ $size }) =>
    $size === 'lg' &&
    css`
      ${media(
        'minTablet',
        css`
          ${lgInputStyle}
        `
      )}
    `}
`

export const StyledNumberInput = styled(StyledBaseInput)<{ $focused: boolean }>`
  .tooltip {
    ${inlineFlexbox()}
    ${textStyle('body', 4)}
    position: absolute;
    top: -12px;
    left: 16px;
    height: 24px;
    padding: 0 8px;
    line-height: 1;
    background-color: var(--gray-700);
    border-radius: 2px;
    pointer-events: none;
    box-shadow: 0 2px 10px 0 rgba(var(--black-rgb), 0.1);
  }

  .maxButton {
    ${posCenterY()}
    ${textStyle('body', 3)}
    z-index: 1;
    flex-shrink: 0;
    padding: 0 12px;
    width: ${MAX_BUTTON_WIDTH_MOBILE}px;
    height: ${MAX_BUTTON_HEIGHT_MOBILE}px;
    color: var(--white);
    background-color: rgba(var(--white-rgb), 0.1);
    border-radius: 4px;
    text-transform: capitalize;
    transition: 200ms;

    &:disabled {
      color: rgba(var(--white-rgb), 0.4);
      cursor: not-allowed;
    }
  }

  ${({ $error }) =>
    $error &&
    css`
      .input {
        color: var(--error-500);
      }
    `}

  ${({ $disabled, $focused }) =>
    !$disabled &&
    $focused &&
    css`
      .maxButton {
        color: var(--white);
      }
    `}

  ${({ $size }) =>
    $size === 'sm' &&
    css`
      .input {
        padding-right: ${MAX_BUTTON_WIDTH_MOBILE + 8 * 2}px;
      }

      .maxButton {
        right: 8px;
      }
    `}

  ${({ $size }) =>
    $size === 'lg' &&
    css`
      .input {
        padding-right: ${MAX_BUTTON_WIDTH_TABLET + 16 + 8}px;
      }

      .maxButton {
        right: 16px;
      }
    `}

    ${media(
    'minTablet',
    css`
      .tooltip {
        top: -8px;
        left: 20px;
      }

      .input {
        ${textStyle('body', 1, 700)}
        padding-left: 20px;
      }

      .maxButton {
        ${textStyle('body', 1)}
        width: ${MAX_BUTTON_WIDTH_TABLET}px;
        height: ${MAX_BUTTON_HEIGHT_TABLET}px;
      }
    `
  )}
`

export const StyledErrorMessage = styled(motion.p)`
  ${textStyle('body', 3)}
  margin-top: 8px;
  color: var(--error-600);
`

export const StyledFormControl = styled(motion.div)<StyledFormCommonProps>`
  position: relative;
  width: 100%;

  &:has(.errorMsg) {
    & + .availableTokenAmount {
      margin-top: 0;
    }
  }

  .label {
    ${textStyle('body', 2)}
    display: block;
    margin-bottom: 8px;
    font-weight: 700;
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      .label,
      & ~ .availableTokenAmount {
        opacity: 0.6 !important;
      }
    `}
`

export const StyledRangeInput = styled.div`
  height: 24px;
  input[type='range'] {
    width: 100%;
    appearance: none;
    background-color: rgba(var(--white-rgb), 0.05);
    width: 100%;
    height: 8px;
    max-width: 100%;
    outline: none;
    cursor: pointer;
    background-color: rgba(var(--white-rgb), 0.05);
    background-image: linear-gradient(
      to right,
      var(--primary-500),
      var(--primary-500)
    );
    border-radius: 10px;
    background-repeat: no-repeat;
    box-shadow: 0 0 0 1px inset rgba(var(--white-rgb), 0.05);

    &:disabled {
      cursor: not-allowed;
    }

    &:focus {
      outline: none;
    }

    &::-webkit-slider-runnable-track {
      appearance: none;
      border: none;
      box-shadow: none;
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 24px;
      height: 24px;
      background-image: ${gradient(2)};
      border-radius: 50%;
      box-shadow: inset 0 0 2px rgba(15, 22, 36, 0.1),
        0px 8px 20px rgba(19, 32, 57, 0.17);
    }
  }
`
