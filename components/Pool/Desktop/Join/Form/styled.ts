import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { flexbox, gradient, media, textStyle } from 'styles/utils'

import { buttonStyle, lgButtonStyle } from 'components/Button/styled'

export const StyledJoinForm = styled(motion.form)`
  ${flexbox('start')}
  width: 100%;
  flex-direction: column;
  padding: 32px;
  margin-top: 32px;
  background-color: rgba(var(--white-rgb), 0.05);
  border-radius: 12px;

  .arrow {
    margin: 20px 0;
  }

  .joinFormFooter {
    width: 100%;
    padding-top: 24px;
    margin-top: 32px;
  }

  .submitButton {
    ${lgButtonStyle}
  }
`

export const StyledJoinFormHeader = styled.header<{ $disabled: boolean }>`
  position: relative;
  width: 100%;

  .title {
    ${flexbox('start')}
    ${textStyle('title', 1)}
    height: 32px;

    .tokenIconGroup {
      margin-right: 8px;

      .tokenIcon {
        margin-left: -8px;
      }
    }
  }

  .buttonGroup {
    ${flexbox('end')}
    position: absolute;
    top: 0;
    right: 0;

    .optimizeButton {
      &:disabled {
        color: rgba(var(--white-rgb), 0.5);
      }
    }

    button {
      flex-shrink: 0;
    }
  }

  .tooltipGroup {
    .tooltip {
      left: auto;
      right: 0;
      width: min-content;
      transform: none;
    }

    &:has(.optimizeButton:disabled) {
      .tooltip {
        opacity: 0 !important;
      }
    }
  }

  .slippageControl {
    margin-top: 4px;
  }

  .resetButton {
    ${buttonStyle}
    width: 32px;
    height: 32px;
    margin-left: 12px;
    overflow: hidden;
    border-radius: 50%;
    background-color: rgba(var(--white-rgb), 0.05);
    color: var(--white);
    transition: 100ms;

    &:hover:not(:disabled) {
      .icon {
        transform: rotate(360deg);
      }
    }

    &:disabled {
      color: rgba(var(--white-rgb), 0.3);
    }

    .icon {
      transition: 250ms;
    }
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      .title {
        opacity: 0.5;
      }
    `}
`

export const StyledJoinFormProportionalGuide = styled(motion.aside)`
  ${flexbox('between')}
  width: 100%;
  padding: 12px 12px 12px 24px;
  margin-top: 24px;
  background-image: ${gradient(2)};
  border-radius: 6px;

  .title {
    ${textStyle('body', 3, 700)}

    .number {
      margin: 0 0.2em;
      font-weight: 700;
    }
  }

  .addButton {
    flex-shrink: 0;
    margin-left: 10px;

    span {
      margin-left: 0.25em;
      font-weight: 700;
    }
  }
`

export const StyledJoinFormSummary = styled.dl`
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

  ${media(
    'minLaptop',
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
`

export const StyledJoinFormUtils = styled.div`
  ${flexbox('end')}
  position: absolute;
  top: 32px;
  right: 32px;

  .resetButton {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    margin-left: 12px;
    border-radius: 50px;
    background-color: rgba(var(--white-rgb), 0.03);
    font-weight: 700;
    color: var(--white);
  }
`

export const StyledJoinFormUnoptimizableAlert = styled(motion.aside)`
  ${flexbox()}
  width:100%;
  padding: 16px;
  margin-bottom: 32px;
  color: var(--white);
  background-color: var(--error-400);
  border-radius: 8px;

  .title {
    ${textStyle('body', 2)}
    font-weight: 700;
  }

  .icon {
    flex-shrink: 0;
    margin-right: 12px;
  }
`
