import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import {
  GNB_HEIGHT_MOBILE,
  GNB_HEIGHT_TABLET,
  GNB_HEIGHT_DESKTOP,
} from 'styles/constants/dimensions'
import { flexbox, media, noScrollbar } from 'styles/utils'

export const StyledLayout = styled(motion.div)<{ $root?: boolean }>`
  ${flexbox()}
  flex-direction: column;
  width: 100%;
  max-width: 100vw;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  transition: background-color 1000ms;

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
  ${noScrollbar()}
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
