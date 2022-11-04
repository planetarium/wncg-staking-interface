import { motion } from 'framer-motion'
import styled from 'styled-components'

import { buttonStyle } from 'components/Button/styled'
import { flexbox, gradient, textStyle } from 'newStyles/utils'

export const StyledJoinForm = styled(motion.form)`
  width: 100%;
  padding: 32px;
  background-color: rgba(var(--white-rgb), 0.05);
  border-radius: 12px;

  .joinFormOptimizeUnavailable {
    margin-top: 32px;
  }

  .joinFormControl {
    ${flexbox('space-between', 'flex-start')}
    width: 100%;
    margin-top: 32px;
  }

  .joinFormInputField {
    width: calc(50% - ${24 / 2}px);

    &:first-child {
      margin-left: 0;
    }
  }

  .joinFormProportionalGuide {
    margin-top: 24px;
  }

  .notOptimizable {
    margin-top: 32px;
  }

  .highPriceImpact,
  .rektPriceImpact {
    margin-top: 12px;
  }

  .joinFormFooter {
    margin-top: 60px;
  }
`

export const StyledJoinFormFooter = styled.footer`
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

export const StyledJoinFormHeader = styled.header`
  position: relative;

  .title {
    ${flexbox('flex-start')}
    ${textStyle('title')}
    margin-bottom: 8px;

    .tokens {
      ${flexbox('flex-start')}
      flex-shrink: 0;
      margin-right: 8px;

      .tokenIcon {
        &:first-child {
          position: relative;
          margin-left: 0;
        }

        margin-left: -8px;
      }
    }
  }

  .buttonGroup {
    ${flexbox('flex-end')}
    position: absolute;
    top: 0;
    right: 0;

    button {
      flex-shrink: 0;
    }
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
`

export const StyledJoinFormField = styled.fieldset`
  padding: 0;
  border: 0;

  .inputLabel {
    ${flexbox('space-between')}
    position: relative;
    z-index: 1;
    margin-bottom: 8px;

    .label {
      ${textStyle('body', 2)}
      font-weight: 700;

      .toggle {
        font-size: 16px;
        font-weight: 700;
        line-height: 24px;
      }

      .icon {
        width: 24px;
        height: 24px;
      }
    }

    .weight {
      ${textStyle('body', 3)}
      flex-grow: 1;
      padding-left: 8px;
      text-align: right;
    }
  }

  .joinFormWarning {
    margin-top: 8px;
  }
`

export const StyledJoinFormAlert = styled(motion.aside)`
  ${flexbox()}
  padding: 16px;
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

export const StyledJoinFormProportionalGuide = styled(motion.aside)`
  ${flexbox('space-between')}
  padding: 12px 12px 12px 24px;
  background-image: ${gradient(2)};
  border-radius: 6px;

  .title {
    ${textStyle('body', 3)}
    font-weight: 700;
  }

  .addButton {
    flex-shrink: 0;
    margin-left: 10px;
  }
`

export const StyledJoinFormSummary = styled.dl`
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
    ${flexbox('flex-start')}
    ${textStyle('title')}
      transition: 150ms;

    &.enabled {
      color: var(--primary-300);
    }
  }

  .summaryItem {
    ${flexbox('space-between')}
    margin-top: 12px;

    &:first-child {
      margin-top: 0;
    }

    dt {
      ${textStyle('subtitle', 1)}
      white-space: nowrap;
      margin-right: 12px;
    }

    dd {
      ${textStyle('title')}
      flex-grow: 1;
      color: rgba(var(--white-rgb), 0.8);
      text-align: right;

      &.alert {
        color: rgba(var(--error-400-rgb), 0.8) !important;
      }
    }
  }
`

export const StyledJoinFormWarning = styled(motion.aside)`
  ${flexbox('flex-start')}
  padding: 12px 16px;
  color: var(--white);
  background-color: var(--blue-600);
  border-radius: 4px;

  .title {
    ${textStyle('body', 3)}
  }

  .icon {
    flex-shrink: 0;
    margin-right: 12px;
  }
`
