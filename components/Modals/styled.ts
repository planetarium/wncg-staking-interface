import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { backdropFilter, flexbox, media, posCenter } from 'styles/utils'

export const StyledModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  width: 100%;
  max-width: 100vw;
  height: 100vh;
  max-height: -webkit-fill-available;
  overflow: hidden;
  background-color: rgba(var(--realBlack-rgb), 0.8);

  ${media(
    'minLaptop',
    css`
      ${backdropFilter(
        64,
        'rgba(var(--realBlack-rgb), 0.64)',
        'rgba(var(--realBlack-rgb), 0.8)'
      )}
    `
  )}
`

export const StyledModalContainer = styled(motion.aside)`
  ${flexbox()}
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 100;

  ${media(
    'minSmLaptop',
    css`
      ${posCenter()}
      bottom: auto;
      width: 640px;
      max-width: min-content;
    `
  )}
`
