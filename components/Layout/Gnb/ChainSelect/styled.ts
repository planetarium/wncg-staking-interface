import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { flexbox, media, textStyle } from 'styles/utils'

export const StyledGnbChainSelect = styled.div`
  ${flexbox('start')}
  position: relative;
  width: auto;
  margin-right: 8px;

  ${media(
    'minTablet',
    css`
      margin-left: 16px;
    `
  )}

  ${media(
    'minLaptop',
    css`
      margin-right: 0;
      margin-left: 8px;
    `
  )}
`

export const StyledGnbChainSelectMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 200px;
  padding: 8px;
  background-color: var(--white);
  border-radius: 8px;
  overflow: hidden;

  li {
    margin-top: 2px;

    &:first-child {
      margin-top: 0;
    }

    &.selected {
      .chainButton {
        font-weight: 700;
        color: var(--gray-900);
      }
    }
  }

  .chainButton {
    ${flexbox('start')}
    ${textStyle('body', 2)}
    width: 100%;
    padding: 8px;
    color: var(--gray-500);
    border-radius: 8px;
    transition: 200ms;

    &:hover {
      background-color: var(--gray-100);
    }

    .cryptoIcon {
      margin-right: 8px;
    }
  }
`

export const StyledGnbChainSelectToggle = styled.button`
  ${flexbox('start')}
  width: 120px;
  height: 40px;
  padding: 0 8px;
  border: 1px solid rgba(var(--white-rgb), 0.2);
  border-radius: 4px;
  transition: 200ms;

  &:disabled {
    border: 1px solid rgba(var(--white-rgb), 0);
    background-color: rgba(var(--white-rgb), 0.1);
  }

  .cryptoIcon {
    flex-shrink: 0;
  }

  .text {
    ${textStyle('caption')}
    margin-left: 4px;
    color: var(--gray-100);
    white-space: nowrap;
  }

  ${media(
    'minTablet',
    css`
      width: 144px;
      padding: 0 12px;

      &:not(:disabled):hover {
        background-color: rgba(var(--white-rgb), 0.1);
      }

      .text {
        ${textStyle('body', 3)}
        margin-left: 8px;
      }
    `
  )}

  ${media(
    'minLaptop',
    css`
      justify-content: center;
      width: 48px;
      height: 48px;
      border: 1px solid rgba(var(--white-rgb), 0.2);
      border-radius: 4px;

      .text {
        display: none;
      }
    `
  )}

  ${media(
    'minDesktop',
    css`
      width: 56px;
      height: 56px;
    `
  )}
`
