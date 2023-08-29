import styled, { css } from 'styled-components'
import { motion } from 'framer-motion'

import { lgButtonStyle, mdButtonStyle } from 'components/Button/styled'
import { mdInputStyle, smInputStyle } from 'components/Form/styled'

import { flexbox, media, textStyle } from 'styles/utils'

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
