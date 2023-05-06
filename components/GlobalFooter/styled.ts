import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { flexbox, media, textStyle } from 'styles/utils'
import {
  GLOBAL_FOOTER_HEIGHT_LAPTOP,
  GLOBAL_FOOTER_HEIGHT_MOBILE,
  GUTTER_MOBILE,
  GUTTER_TABLET,
} from 'styles/constants/dimensions'

const LINK_BUTTON_PADDING = 4

export const StyledGlobalFooter = styled(motion.footer)`
  position: relative;
  width: 100%;
  height: ${GLOBAL_FOOTER_HEIGHT_MOBILE}px;
  padding: 24px ${GUTTER_MOBILE}px 32px;

  color: var(--gray-500);
  background-color: rgba(var(--white-rgb), 0.05);

  .env {
    ${textStyle('body', 4)}
    position: absolute;
    top: 0;
    left: 0;
    padding: 4px;
    color: var(--white);
    background-color: var(--black);
    border-radius: 4px;
  }

  .right {
    ${flexbox()}
    margin-top: 10px;
  }

  .title {
    ${flexbox('between', 'start')}
    ${textStyle('caption')}
    color: var(--gray-300);

    strong {
      flex-shrink: 0;
      margin-right: 8px;
      white-space: nowrap;
    }

    span {
      text-align: right;
    }
  }

  .buttonGroup {
    margin-top: ${24 - LINK_BUTTON_PADDING}px;
  }

  .linkButton {
    ${textStyle('body', 4)}
    display: block;
    padding: ${LINK_BUTTON_PADDING}px 0;
    margin-top: ${12 - LINK_BUTTON_PADDING * 2}px;

    &:first-child {
      margin-top: 0;
    }

    a {
      text-decoration: underline;
    }
  }

  .iconButton {
    ${flexbox()}
    width: 48px;
    height: 48px;
    margin-left: 12px;
    color: var(--gray-300);
    border-radius: 50%;

    &:first-child {
      margin-left: 0;
    }
  }

  ${media(
    'minTablet',
    css`
      padding: 32px;
    `
  )}

  ${media(
    'minLaptop',
    css`
      ${flexbox('between')}
      width: 100%;
      height: ${GLOBAL_FOOTER_HEIGHT_LAPTOP}px;
      padding: 0 ${GUTTER_TABLET}px;

      .left,
      .right {
        ${flexbox('start')}
      }

      .right {
        margin-top: 0;
      }

      .title {
        ${textStyle('body', 4)}
      }

      .buttonGroup {
        ${flexbox('start')}
        margin-top: 0;
      }

      .linkButton {
        margin-top: 0;
        margin-left: 32px;
      }
    `
  )}

  ${media(
    'minTablet',
    css`
      .title {
        ${textStyle('body', 4)}
      }
    `
  )}

  ${media(
    'minDesktop',
    css`
      .container {
        padding-right: 0;
        padding-left: 0;
      }
    `
  )}
`

export const StyledGlobalFooterImportTokenDropdown = styled.div`
  position: relative;
  display: none;

  .tokenToggle {
    ${flexbox()}
    ${textStyle('button', 3)}
    height: 32px;
    padding: 0 16px;
    border-radius: 4px;
    color: rgba(var(--gray-25-rgb), 0.9);
    background-color: rgba(var(--primary-50-rgb), 0.06);

    .connectorIcon {
      flex-shrink: 0;
      margin-left: 10px;
    }
  }

  ${media(
    'minLaptop',
    css`
      display: block;
    `
  )}
`

export const StyledGlobalFooterImportTokenDropdownMenu = styled(motion.div)`
  position: absolute;
  width: min-content;
  bottom: calc(100% + 8px);
  right: 0;
  padding: 8px;
  border-radius: 4px;
  background-color: var(--white);
  box-shadow: 0px 4px 16px rgba(var(--realBlack-rgb), 0.16);

  .token {
    margin-left: 4px;
  }

  .tokenButton {
    ${flexbox('between')}
    ${textStyle('button', 3)}
    min-width: 160px;
    width: 100%;
    padding: 4px;
    margin-top: 4px;
    border-radius: 4px;
    color: var(--gray-900);
    text-align: left;
    white-space: nowrap;
    transition: 200ms;

    &:first-child {
      margin-top: 0;
    }

    &:hover {
      background-color: var(--gray-100);
    }

    .token {
      flex-shrink: 0;
      margin-left: 8px;
    }
  }
`
