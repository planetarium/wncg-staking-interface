import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { flexbox, media, posCenter } from 'styles/utils'

export const StyledModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  max-width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: rgba(var(--realBlack), 0.6);
  backdrop-filter: blur(50px);
  transition: 200ms;
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
