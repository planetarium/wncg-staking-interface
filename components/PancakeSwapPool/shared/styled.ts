import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import {
  flexbox,
  gradient,
  media,
  posCenterX,
  posCenterY,
  textStyle,
} from 'styles/utils'
import {
  buttonStyle,
  lgButtonStyle,
  mdButtonStyle,
} from 'components/Button/styled'

const INPUT_FIELD_GAP = 24

const ARROW_SIZE = 32
const DASH_HEIGHT = 24
const STROKE_WIDTH = 2

export const StyledAddLiquidityFormArrow = styled.span<{ $disabled: boolean }>`
  ${flexbox()}
  position: relative;
  width: ${ARROW_SIZE}px;
  height: ${ARROW_SIZE}px;
  margin: 12px auto;
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

export const StyledAddLiquidityFormSummary = styled(motion.footer)<{
  $active: boolean
  $disabled: boolean
}>`
  width: 100%;
  padding: 24px;
  margin-top: 16px;
  border: 1px solid rgba(var(--white-rgb), 0.4);
  border-radius: 8px;
  transition: border-color 200ms;

  .title {
    ${textStyle('body', 1)}
    font-weight: 700;
    text-align: center;
  }

  .summaryList {
    margin-top: 24px;
  }

  .summaryItem {
    position: relative;
    padding: 8px 0;
    color: var(--gray-25);

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

  ${media(
    'minTablet',
    css`
      margin-top: 0;

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
    `
  )}

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

export const StyledAddLiquidityFormUnoptimizableAlert = styled(motion.aside)`
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

export const StyledAddLiquidityFormFooter = styled.footer<{
  $disabled: boolean
}>`
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
