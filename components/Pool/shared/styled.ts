import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { flexbox, gradient, media, textStyle } from 'styles/utils'
import {
  buttonStyle,
  lgButtonStyle,
  mdButtonStyle,
} from 'components/Button/styled'

const INPUT_FIELD_GAP = 24

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

export const StyledJoinFormProportionalGuideBanner = styled(motion.aside)`
  width: 100%;
  padding: 10px 12px;
  margin-top: 24px;
  border-radius: 6px;
  background-color: var(--primary-500);

  .title {
    ${flexbox('start')}
    ${textStyle('body', 4, 700)}
  }

  .desc {
    flex-grow: 1;
  }

  .addButton {
    ${buttonStyle}
    ${textStyle('button', 3)}
    position: relative;
    flex-shrink: 0;
    padding: 4px 12px;
    margin-top: 10px;
    color: rgba(var(--gray-100-rgb), 0.9);
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

  .desc {
    font-weight: 500;

    .number {
      margin: 0 0.2em;

      .symbol {
        margin-left: 0.2em;
      }
    }
  }

  ${media(
    'minSmLaptop',
    css`
      ${flexbox('start')}
      padding: 10px 12px;
      margin-top: 24px;
      margin-bottom: 0;

      .title {
        ${textStyle('body', 4, 700)}

        &::after {
          display: block;
          width: 2px;
          height: 10px;
          margin: 0 10px;
          border-radius: 40px;
          background-color: var(--primary-400);
          content: '';
        }

        .icon {
          margin-right: 8px;
        }
      }

      .desc {
        ${textStyle('body', 4)}
        color: rgba(var(--gray-100-rgb), 0.8);
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

export const StyledJoinFormUnoptimizableAlert = styled(motion.aside)`
  ${flexbox()}
  width: 100%;
  padding: 12px;
  margin-top: 24px;
  background-color: var(--error-400);
  border-radius: 6px;

  .desc {
    ${textStyle('body', 4, 700)}
    margin-left: 12px;
    color: var(--white);
  }

  ${media(
    'minTablet',
    css`
      padding: 8px 12px;
      margin-top: 32px;
    `
  )}
`

export const StyledJoinFormOptimizedBanner = styled(motion.aside)`
  ${textStyle('body', 4)}
  width: 100%;
  padding: 12px;
  margin-top: 24px;
  background-color: var(--primary-500);
  border-radius: 8px;

  .title {
    ${flexbox('start')}
    ${textStyle('body', 4, 700)}

    .icon {
      margin-left: 4px;
    }
  }

  .desc {
    margin-top: 4px;
    color: rgba(var(--white-rgb), 0.8);
  }

  ${media(
    'minSmLaptop',
    css`
      ${flexbox('start')}
      padding: 8px 12px;
      margin-top: 32px;

      .title {
        margin-right: 8px;

        &::after {
          display: block;
          width: 2px;
          height: 10px;
          margin-left: 10px;
          content: '';
          border-radius: 10px;
          background-color: var(--primary-400);
        }

        .icon {
          margin-left: 2px;
        }
      }

      .desc {
        margin-top: 0;
        color: var(--white);
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
