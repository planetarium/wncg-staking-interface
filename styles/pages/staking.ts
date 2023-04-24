import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { flexbox, media } from 'styles/utils'
import {
  GLOBAL_FOOTER_HEIGHT_LAPTOP,
  GLOBAL_FOOTER_HEIGHT_MOBILE,
  GUTTER_TABLET,
} from 'styles/constants/dimensions'

const MAIN_PADDING_MOBILE = 32
const MAIN_PADDING_TABLET = 16
const MAIN_PADDING_LAPTOP = 160
const MAIN_PADDING_DESKTOP = 145

export const StyledStakingPage = styled(motion.div)`
  min-height: calc(100% - ${GLOBAL_FOOTER_HEIGHT_MOBILE}px);
  padding-top: ${MAIN_PADDING_MOBILE}px;
  padding-bottom: 80px;

  .container {
    ${flexbox('start', 'start')}
    width: 100%;
    flex-direction: column-reverse;

    .left,
    .right {
      width: 100%;
    }
  }

  ${media(
    'minTablet',
    css`
      max-width: ${560 + GUTTER_TABLET * 2}px;
      padding-top: ${MAIN_PADDING_TABLET}px;
      padding-bottom: ${16 + 36}px;
      margin: 0 auto;
    `
  )}

  ${media(
    'minLaptop',
    css`
      ${flexbox()}
      max-width: unset;
      min-height: calc(100% - ${GLOBAL_FOOTER_HEIGHT_LAPTOP}px);
      padding-top: ${MAIN_PADDING_LAPTOP}px;
      padding-bottom: ${MAIN_PADDING_LAPTOP}px;

      .container {
        ${flexbox('between', 'start')}
        flex-direction: row;
        width: 100%;
        max-width: ${1366 + GUTTER_TABLET * 2}px;

        .left,
        .right {
          width: 50%;
          max-width: 620px;
        }

        .left {
          max-width: 560px;
          margin-left: 0;
        }

        .right {
          align-self: stretch;
          padding-bottom: ${56 + 8}px;
        }
      }
    `
  )}

  ${media(
    'minDesktop',
    css`
      padding: ${MAIN_PADDING_DESKTOP}px 0;

      .container {
        max-width: ${1440 + GUTTER_TABLET * 2}px;

        .right {
          max-width: 660px;
        }

        .left {
          max-width: 580px;
        }
      }
    `
  )}
`
