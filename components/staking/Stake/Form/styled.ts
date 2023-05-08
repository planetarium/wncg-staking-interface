import styled, { css } from 'styled-components'
import { motion } from 'framer-motion'

import { lgButtonStyle, mdButtonStyle } from 'components/Button/styled'
import { mdInputStyle, smInputStyle } from 'components/Form/styled'

import {
  flexbox,
  media,
  scrollbar,
  textGradient,
  textStyle,
} from 'styles/utils'

export const StyledStakeForm = styled(motion.form)`
  position: relative;
  z-index: 1;
  width: 100%;

  .inputGroup {
    flex-grow: 1;

    .baseInput {
      ${smInputStyle}

      .input {
        ${textStyle('body', 3, 700)}
        padding-right: ${54 + 8 * 2}px;
      }

      .maxButton {
        right: 8px;
      }
    }
  }

  .submitButton {
    ${mdButtonStyle}
    margin-top: 16px;
  }

  ${media(
    'minTablet',
    css`
      .availableTokenAmount {
        flex-wrap: nowrap;
        white-space: nowrap;
      }

      .inputGroup {
        .baseInput {
          ${mdInputStyle}

          .input {
            ${textStyle('body', 1, 700)}
            padding-right: ${80 + 16 + 8}px;
          }
        }
      }

      .field {
        ${flexbox('start', 'start')}
        width: 100%;
        margin: 0 auto;
      }

      .submitButton {
        ${lgButtonStyle}
        flex-shrink: 0;
        width: 120px;
        margin-top: 0;
        margin-left: 16px;
      }
    `
  )}

  ${media(
    'minLaptop',
    css`
      max-width: 560px;

      .inputGroup {
        width: calc(100% - ${144 + 16}px);
        flex-shrink: 0;
        flex-grow: 0;
      }

      .submitButton {
        width: 144px;
        height: 72px;
      }
    `
  )}

  ${media(
    'minDesktop',
    css`
      max-width: 580px;
    `
  )}
`

export const StyledStakeFormRevenuePopup = styled(motion.aside)`
  ${scrollbar()}
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 1;
  padding: 20px;
  width: 100%;
  height: 240px;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: var(--primary-900);
  border-radius: 8px;
  box-shadow: -12px 12px 96px rgba(89, 0, 209, 0.5),
    16px 16px 96px rgba(30, 78, 84, 0.5);
  backdrop-filter: blur(24px);

  .header {
    ${flexbox('start')}

    .icon {
      margin-right: 4px;
      color: var(--primary-50);
    }

    .title {
      ${textStyle('body', 3, 700)}
      ${textGradient(3)}
    }
  }

  .content {
    margin-top: 16px;
  }

  .revenueItem {
    width: 100%;
    margin-top: 16px;

    &:first-child {
      margin-top: 0;
    }

    dt {
      ${textStyle('caption')}
      flex-shrink: 0;
      width: 200px;
      white-space: nowrap;
      font-weight: 700;
      color: var(--primary-300);

      time {
        margin-left: 8px;
        font-weight: 500;
        color: rgba(var(--white-rgb), 0.8);
      }
    }

    dd {
      ${flexbox('between')}
      width: 100%;
      margin-top: 8px;
    }

    .revenueGroup {
      width: calc(50% - 8px);

      .token {
        ${flexbox('start')}

        .tokenIcon {
          margin-right: 4px;
        }

        .countUp {
          ${textStyle('body', 4, 700)}
          color: var(--white);
        }
      }

      .fiatValue {
        ${textStyle('caption')}
        display: block;
        margin-top: 2px;
        color: rgba(var(--gray-25-rgb), 0.8);
      }
    }
  }

  ${media(
    'maxLaptop',
    css`
      display: none !important;
    `
  )}
`
