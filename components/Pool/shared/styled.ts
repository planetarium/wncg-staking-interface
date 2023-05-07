import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import {
  buttonStyle,
  lgButtonStyle,
  mdButtonStyle,
} from 'components/Button/styled'

import { flexbox, gradient, media, textStyle } from 'styles/utils'

const INPUT_FIELD_GAP = 24

export const StyledJoinFormAlert = styled(motion.aside)`
  ${flexbox()}
  ${textStyle('body', 2)}
    width: 100%;
  height: 56px;
  margin-bottom: 32px;
  font-weight: 700;
  background-color: var(--error-400);
  border-radius: 8px;

  .icon {
    margin-right: 12px;
  }
`

export const StyledJoinFormInputField = styled(motion.div)`
  width: 100%;

  .labelGroup {
    ${flexbox('between')}
    margin-bottom: 8px;
    white-space: nowrap;

    .label {
      ${textStyle('body', 2)}
      font-weight: 700;
      color: var(--white);
    }

    .weight {
      ${textStyle('body', 3)}
      color: rgba(var(--white-rgb), 0.5);
    }
  }

  ${media(
    'minTablet',
    css`
      width: calc(50% - ${INPUT_FIELD_GAP / 2}px);
    `
  )}
`

export const StyledJoinFormProportionalGuide = styled(motion.aside)`
  width: 100%;
  padding: 16px;
  margin-top: 24px;
  background-image: ${gradient(2)};
  border-radius: 6px;

  .title {
    ${textStyle('body', 4, 700)}

    .number {
      margin: 0 0.2em;
      font-weight: 700;

      .symbol {
        margin-left: 0.2em;
      }
    }
  }

  .addButton {
    ${buttonStyle}
    ${textStyle('button', 3)}
    position: relative;
    flex-shrink: 0;
    padding: 8px 16px;
    margin-top: 10px;
    color: var(--white);
    background-color: rgba(var(--white-rgb), 0.1);
    border-radius: 50px;

    &::before {
      width: 100%;
      height: 100%;
      background-image: ${gradient(6)};
      content: '';
      transition: 200ms;
      opacity: 0;
    }

    span {
      margin-right: 0.2em;
      margin-left: 0.25em;
      font-weight: 700;
    }
  }

  ${media(
    'minSmLaptop',
    css`
      ${flexbox('between')}
      padding: 12px 12px 12px 24px;
      margin-top: 24px;
      margin-bottom: 0;

      .title {
        ${textStyle('body', 3, 700)}
      }

      .addButton {
        margin-top: 0;
        margin-left: 10px;

        &:hover {
          &::before {
            opacity: 1;
          }
        }
      }
    `
  )}
`

export const StyledJoinFormSummary = styled.dl<{ $disabled: boolean }>`
  width: 100%;
  margin-top: 24px;
  border-top: 2px solid rgba(var(--white-rgb), 0.1);
  padding-top: 24px;

  .text,
  .value {
    width: calc(50% - 4px);
  }

  .text {
    ${textStyle('body', 3)}
    text-align: right;
  }

  .value {
    ${flexbox('start')}
    ${textStyle('body', 1, 700)}
      transition: 150ms;

    &.enabled {
      color: var(--primary-300);
    }
  }

  .summaryItem {
    ${flexbox('between')}
    width: 100%;
    margin-top: 12px;

    &:first-child {
      margin-top: 0;
    }

    dt {
      ${textStyle('body', 1, 700)}
      white-space: nowrap;
      margin-right: 12px;
    }

    dd {
      flex-grow: 1;
      color: rgba(var(--white-rgb), 0.8);
      text-align: right;

      &.alert {
        color: rgba(var(--error-400-rgb), 0.8) !important;
      }

      .number {
        ${textStyle('body', 1, 700)}
      }
    }
  }

  .priceImpactAlert {
    margin-top: 12px;
  }

  ${media(
    'minSmLaptop',
    css`
      .value {
        ${textStyle('title')}
      }

      .summaryItem {
        dt {
          ${textStyle('subtitle', 1)}
        }

        dd {
          .number {
            ${textStyle('title')}
          }
        }
      }
    `
  )}

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
    `}
`

export const StyledJoinFormUnoptimizable = styled(motion.aside)`
  ${flexbox()}
  width: 100%;
  padding: 10px 16px;
  margin: 32px 0;
  color: var(--white);
  background-color: var(--error-400);
  border-radius: 8px;

  .title {
    ${textStyle('body', 4, 700)}
  }

  .icon {
    flex-shrink: 0;
    margin-right: 12px;
  }

  ${media(
    'minSmLaptop',
    css`
      padding: 16px;

      .title {
        ${textStyle('body', 2, 700)}
      }
    `
  )}
`

export const StyledJoinFormFooter = styled.footer<{ $disabled: boolean }>`
  position: relative;

  .submitButton {
    ${mdButtonStyle}
  }

  ${media(
    'minSmLaptop',
    css`
      .submitButton {
        ${lgButtonStyle}
      }
    `
  )}

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
    `}
`
