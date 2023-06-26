import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { flexbox, media, textStyle } from 'styles/utils'
import { buttonStyle } from 'components/Button/styled'

export const StyledAddLiquidityForm = styled(motion.form)`
  ${flexbox('start')}
  position: relative;
  flex-direction: column;
  margin-top: 32px;

  .dashedArrow {
    margin: 20px 0;
  }

  .joinFormFooter {
    width: 100%;
    margin-top: ${24 + 32}px;
  }
`

export const StyledPancakeSwapPoolHeader = styled.header<{
  $disabled: boolean
}>`
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

export const StyledAddLiquidityFormAlert = styled(motion.aside)<{
  $error?: boolean
  $optimized?: boolean
}>`
  ${textStyle('body', 4)}
  width: 100%;
  padding: 12px;
  margin-top: 24px;
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
