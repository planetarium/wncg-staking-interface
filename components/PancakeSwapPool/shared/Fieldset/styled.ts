import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { flexbox, media, posCenterX, posCenterY, textStyle } from 'styles/utils'
import { mdInputStyle, smInputStyle } from 'components/Form/styled'

const INPUT_FIELD_GAP = 24

const ARROW_SIZE = 32
const DASH_HEIGHT = 24
const STROKE_WIDTH = 2

export const StyledAddLiquidityForm = styled(motion.form)`
  ${flexbox('start')}
  flex-direction: column;

  .dashedArrow {
    margin: 20px 0;
  }

  .joinFormFooter {
    width: 100%;
    margin-top: ${24 + 32}px;
  }
`

export const StyledAddLiquidityFormArrow = styled.span<{ $disabled: boolean }>`
  ${flexbox()}
  position: relative;
  width: ${ARROW_SIZE}px;
  height: ${ARROW_SIZE}px;
  margin: 12px 0;
  transition: 200ms;
  color: var(--white);

  .icon {
    ${posCenterX()}
    top: 12px;
  }

  .dashed {
    display: block;
    width: ${STROKE_WIDTH}px;
    height: ${DASH_HEIGHT}px;
    border-radius: 100px;
    animation: dash 1.5s linear infinite;
    background-image: linear-gradient(
      to bottom,
      transparent,
      transparent 50%,
      var(--white) 50%,
      var(--white) 100%
    );
    background-repeat: repeat-y;
    background-size: 100% ${DASH_HEIGHT / 3}px;
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;

      .dashed {
        animation: none;
      }
    `}

  @keyframes dash {
    0% {
      background-position: 100% 0, 0 100%;
    }

    100% {
      background-position: 100% 100%, 100% 0;
    }
  }
`

export const StyledAddLiquidityFormAlert = styled(motion.aside)<{
  $error?: boolean
  $optimized?: boolean
}>`
  ${textStyle('body', 4)}
  width: 100%;
  padding: 12px;
  margin-bottom: 32px;
  background-color: ${({ $error }) =>
    $error ? 'var(--error-400)' : 'var(--primary-500)'};
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
    'minLaptop',
    css`
      ${flexbox('start')}
      padding: 8px 12px;

      .title {
        margin-right: 8px;

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

  ${({ $optimized }) =>
    $optimized &&
    css`
      ${media(
        'minLaptop',
        css`
          .title {
            &::after {
              display: block;
              width: 2px;
              height: 10px;
              margin-left: 10px;
              content: '';
              border-radius: 10px;
              background-color: var(--primary-400);
            }
          }
        `
      )}
    `}
`

export const StyledAddLiquidityFormEtherSelect = styled.div`
  .dropdownToggle {
    ${textStyle('body', 4, 700)}

    .icon {
      margin-left: 4px;
    }
  }

  .menuItem {
    &.selected {
      color: var(--gray-900);

      .label {
        font-weight: 700 !important;
      }
    }

    .label {
      color: var(--gray-500);
      font-weight: 500 !important;
    }
  }

  ${media(
    'minLaptop',
    css`
      .dropdownToggle {
        ${textStyle('body', 2, 700)}
      }
    `
  )}
`

export const StyledAddLiquidityFormFieldset = styled(motion.fieldset)<{
  $reverse?: boolean
}>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
  margin-top: 24px;
  border: 0;

  .joinInputField {
    width: 100%;
    margin-top: 24px;

    &:first-child {
      margin-top: 0;
    }
  }

  ${media(
    'minTablet',
    css`
      ${flexbox('between', 'start')}
      flex-direction: row;
      margin-top: 32px;

      .joinInputField {
        width: calc(50% - ${24 / 2}px);
        margin-top: 0 !important;
        margin-left: 16px;

        &:first-child {
          margin-left: 0;
        }
      }
    `
  )}

  ${({ $reverse }) =>
    $reverse &&
    css`
      flex-direction: column-reverse;

      .joinInputField {
        margin-top: 0;

        &:first-child {
          margin-top: 24px;
        }
      }

      ${media(
        'minTablet',
        css`
          flex-direction: row-reverse;

          .joinInputField {
            margin-left: 0;

            &:first-child {
              margin-left: 16px;
            }
          }
        `
      )}
    `}
`

export const StyledAddLiquidityFormInputField = styled(motion.div)<{
  $disabled: boolean
}>`
  width: calc(50% - ${INPUT_FIELD_GAP / 2}px);

  .labelGroup {
    ${flexbox('between')}
    margin-bottom: 8px;
    white-space: nowrap;

    > .label {
      ${textStyle('body', 3, 700)}
      color: var(--white);
    }

    .misc {
      ${textStyle('caption')}
      margin-left: 4px;
      color: var(--warning-200);
      opacity: 0;
      transition: 200ms;

      &.active {
        opacity: 1;
      }
    }

    .weight {
      ${textStyle('body', 3)}
      color: rgba(var(--white-rgb), 0.9);
    }

    .selectGroup {
      ${flexbox('start')}
    }
  }

  .baseInput {
    ${smInputStyle}

    .input {
      ${textStyle('body', 3, 700)}
      padding-right: ${54 + 8 * 2}px;
    }

    .maxButton {
      ${textStyle('body', 3)}
      right: 8px;
      width: 54px;
      height: 36px;
    }
  }

  .availableTokenAmount {
    dd {
      flex-wrap: wrap;

      .number {
        margin-right: 4px;
      }

      .parenthesis {
        margin-left: 0;

        .number {
          margin-right: 0px;
        }
      }
    }
  }

  ${media(
    'minLaptop',
    css`
      .labelGroup {
        .label {
          ${textStyle('body', 2, 700)}
        }

        .misc {
          ${textStyle('body', 3)}
        }

        .weight {
          ${textStyle('body', 3)}
        }
      }
    `
  )}

  ${media(
    'minLaptop',
    css`
      .baseInput {
        ${mdInputStyle}

        .input {
          ${textStyle('body', 1, 700)}
          padding-right: ${80 + 16 + 8}px;
        }

        .maxButton {
          ${textStyle('body', 1)}
          right: 12px;
          width: 80px;
          height: 48px;
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

export const StyledAddLiquidityFormSummary = styled(motion.footer)<{
  $active: boolean
  $disabled: boolean
}>`
  width: 100%;
  padding: 24px;
  border: 1px solid rgba(var(--white-rgb), 0.4);
  border-radius: 8px;
  transition: border-color 200ms;

  .title {
    ${textStyle('body', 1)}
    font-weight: 700;
    text-align: center;
  }

  .summaryList {
    ${flexbox('between', 'stretch')}
    margin-top: 24px;
  }

  .summaryItem {
    position: relative;
    flex-grow: 1;
    flex-shrink: 0;
    width: 33%;
    color: var(--gray-25);
    padding: 0 32px;

    &:first-child {
      padding-left: 0;

      &::after {
        display: none;
      }
    }

    &:last-child {
      padding-right: 0;
    }

    &::after {
      ${posCenterY()}
      content: '';
      left: 0;
      width: 1px;
      height: 56px;
      background-color: var(--white);
      border-radius: 50px;
    }

    .number {
      ${textStyle('body', 2, 700)}

      &::before {
        margin-left: 0;
      }

      span:not(.symbol) {
        margin-right: 0.25em;
      }
    }

    .symbol {
      ${textStyle('body', 4)}
    }

    dt {
      ${textStyle('body', 2)}
      margin-bottom: 4px;
      font-weight: 700;

      .number {
        font-weight: 700;
      }

      .symbol {
        font-weight: 700;
      }
    }

    dd {
      .percent {
        font-weight: 500;
      }

      .tokenPrice,
      .fiatPrice {
        ${flexbox('start')}
        flex-wrap: wrap;
        font-weight: 500;
      }

      .fiatPrice {
        ${textStyle('body', 4)}
        margin-top: 2px;
        color: var(--gray-500);
      }
    }
  }

  ${({ $active }) =>
    $active &&
    css`
      border-color: var(--white);
    `}

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
    `}
`

export const StyledAddLiquidityFormUtils = styled.div`
  ${flexbox('end')}
  position: absolute !important;
  top: 32px;
  right: 32px;

  .tooltipGroup {
    right: 0;
  }

  .toggler:disabled {
    color: rgba(var(--white-rgb), 0.5);

    + .tooltip {
      opacity: 0 !important;
    }
  }

  .tooltip {
    right: 0;
    left: auto;
    transform: none;
    background-color: var(--gray-700);
  }
`

export const StyledAddLiquidityFormNoticeContent = styled(motion.aside)<{
  $suggestion?: boolean
}>`
  ${textStyle('body', 4)}
  padding: 16px;
  margin-top: 8px;
  background-color: var(--primary-50);
  border-radius: 4px;
  transition: 200ms;

  .badge {
    ${flexbox('start')}
    ${textStyle('body', 4, 700)}
    color: var(--primary-500);

    .icon {
      margin-right: ${2 + 4}px;
      margin-left: 2px;
    }

    .lottie {
      width: 16px;
      height: 16px;
      overflow: hidden;

      > div {
        position: relative;
        top: 2px;
        width: 36px !important;
        height: 36px !important;

        svg {
          width: 36px !important;
          height: 36px !important;
        }
      }
    }
  }

  .title {
    ${textStyle('body', 4, 700)}
    padding: 0 2px;
    margin-top: 8px;
    color: var(--gray-700);
  }

  .desc {
    padding: 0 2px;
    margin-top: 2px;
    color: var(--gray-600);
  }

  ${media(
    'minTablet',
    css`
      margin-top: 12px;
    `
  )}

  ${({ $suggestion }) =>
    $suggestion &&
    css`
      background-color: #f2fffe;

      .badge {
        color: var(--green-600);
      }
    `}
`
