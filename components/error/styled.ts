import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'
import { GUTTER_TABLET } from 'styles/constants/dimensions'

import { fontFamily } from 'styles/constants/typography'
import { flexbox, media, textStyle } from 'styles/utils'

const GAP_TABLET = 80
const GAP_DESKTOP = 160

const ERROR_CONTAINER_MAX_WIDTH_TABLET = 560

export const StyledErrorPage = styled(motion.main)`
  .container {
    max-width: ${ERROR_CONTAINER_MAX_WIDTH_TABLET + GUTTER_TABLET * 2}px;
  }

  .left {
    width: 160px;
    height: 160px;
    margin-bottom: 48px;
  }

  .right {
    color: var(--white);
  }

  .title {
    font-family: ${fontFamily.display};
    font-size: 4rem;
    font-weight: 900;
    line-height: 1.25;
    letter-spacing: 0.02em;
  }

  .subtitle {
    ${textStyle('title', 1)}
    margin-top: 32px;
  }

  .desc {
    ${textStyle('body', 2)}
    margin-top: 20px;
    color: rgba(var(--white-rgb), 0.5);
  }

  .mainButton {
    width: 200px;
    margin-top: 48px;
  }

  ${media(
    'minTablet',
    css`
      .left {
        width: 320px;
        height: 320px;
        margin-bottom: 80px;
      }

      .title {
        font-size: 6rem;
        line-height: 1.1666666667;
      }

      .subtitle {
        ${textStyle('header', 5)}
      }

      .desc {
        ${textStyle('title')}
        font-weight: 500;
      }

      .mainButton {
        width: 320px;
      }
    `
  )}

  ${media(
    'minLaptop',
    css`
      .container {
        ${flexbox('between')}
        max-width: ${GUTTER_TABLET * 2 + 1280}px;
      }

      .left,
      .right {
        width: 50%;
        height: auto;
      }

      .left {
        padding-right: ${GAP_TABLET / 2}px;
        margin-bottom: 0;
      }

      .right {
        padding-left: ${GAP_TABLET / 2}px;
      }
    `
  )}

  ${media(
    'minLaptop',
    css`
      .left {
        padding-right: ${GAP_DESKTOP / 2}px;
      }

      .right {
        padding-left: ${GAP_DESKTOP / 2}px;
      }
    `
  )}
`
