import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { media } from 'styles/utils'

export const StyledMainPage = styled(motion.div)`
  padding-top: 48px;
  padding-bottom: 120px;

  .cardItem {
    margin-top: 120px;

    &:first-child {
      margin-top: 0;
    }
  }

  ${media(
    'minTablet',
    css`
      padding-top: 120px;
      padding-bottom: 200px;

      .cardItem {
        margin-top: 160px;
      }
    `
  )}

  ${media(
    'minDesktop',
    css`
      padding-bottom: 120px;
    `
  )}
`
