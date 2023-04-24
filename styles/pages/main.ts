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
const MAIN_PADDING_LAPTOP = 80
const MAIN_PADDING_DESKTOP = 145

export const StyledMainPage = styled(motion.div)`
  ${media(
    'minSmLaptop',
    css`
      padding: ${MAIN_PADDING_LAPTOP}px 0;
    `
  )}
`
