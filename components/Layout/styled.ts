import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import {
  GNB_HEIGHT_MOBILE,
  GNB_HEIGHT_TABLET,
  GNB_HEIGHT_DESKTOP,
} from 'styles/constants/dimensions'
import { flexbox, inlineFlexbox, media } from 'styles/utils'

export const StyledLayout = styled(motion.div)<{ $root?: boolean }>`
  ${flexbox()}
  flex-direction: column;
  width: 100%;
  max-width: 100vw;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  transition: 300ms;

  > * {
    width: 100%;
  }

  ${({ $root }) =>
    $root &&
    css`
      background-color: var(--realBlack);
    `}
`

export const StyledMain = styled(motion.main)`
  position: relative;
  width: 100%;
  max-width: 100vw;
  height: calc(100vh - ${GNB_HEIGHT_MOBILE}px);
  overflow-x: hidden;
  overflow-y: auto;

  ${media(
    'minTablet',
    css`
      height: calc(100vh - ${GNB_HEIGHT_TABLET}px);
    `
  )}

  ${media(
    'minDesktop',
    css`
      height: calc(100vh - ${GNB_HEIGHT_DESKTOP}px);
    `
  )}
`

export const StyledPoolModal = styled(motion.div)`
  ${flexbox('start')}
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 32px);
  overflow-x: hidden;
  overflow-y: auto;
  background-color: rgba(18, 18, 18, 0.6);
  backdrop-filter: blur(40px);
  border-radius: 32px 32px 0 0;

  .utils {
    ${flexbox('end', 'end')}
    position: absolute;
    top: 0;
    left: 0;
    z-index: 20;
    flex-shrink: 0;
    width: 100%;
    padding: 32px 48px 16px;
  }

  .content {
    width: 100%;
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: none;
    }

    .container {
      padding-top: 0;
    }
  }

  .closeButton {
    ${inlineFlexbox()}
    color: var(--white);
  }
`

export const StyledPoolModalOverlay = styled(motion.div)<{
  $isSafari?: boolean
}>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(32px);
  cursor: pointer;

  ${({ $isSafari }) =>
    $isSafari &&
    css`
      background-color: rgba(0, 0, 0, 0.8);
    `}
`
