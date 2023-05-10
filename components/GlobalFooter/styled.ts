import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { flexbox, media, posCenterY, textStyle } from 'styles/utils'
import {
  GLOBAL_FOOTER_HEIGHT_LAPTOP,
  GLOBAL_FOOTER_HEIGHT_MOBILE,
  GUTTER_MOBILE,
  GUTTER_TABLET,
} from 'styles/constants/dimensions'
import {
  buttonStyle,
  primaryButtonStyle,
  smButtonStyle,
} from 'components/Button/styled'

const LINK_BUTTON_PADDING = 4

export const StyledGlobalFooter = styled(motion.footer)`
  position: relative;
  width: 100%;
  height: ${GLOBAL_FOOTER_HEIGHT_MOBILE}px;
  padding: 24px ${GUTTER_MOBILE}px 32px;
  color: var(--gray-500);
  background-color: #1c1140; // rgba(var(--white-rgb), 0.05);

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
    color: var(--gray-300);

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
      position: fixed;
      bottom: 0;
      left: 0%;
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
  width: 100%;
  margin-bottom: 24px;

  .tokenToggle {
    ${flexbox()}
    ${textStyle('button', 3)}
    width: 100%;
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
      width: auto;
      margin-bottom: 0;
    `
  )}
`

export const StyledGlobalFooterImportTokenDropdownMenu = styled(motion.div)`
  position: fixed;
  width: 100%;
  bottom: 0;
  right: 0;
  padding: 24px 24px 48px;
  background-color: rgba(var(--white-rgb), 0.08);
  box-shadow: 0px -16px 48px rgba(0, 0, 0, 0.48);
  backdrop-filter: blur(12px);
  border-radius: 16px 16px 0px 0px;

  .dropdownHeader {
    ${flexbox('between')}
    margin-bottom: 24px;

    .title {
      ${textStyle('subtitle', 1)}
      color: var(--white);
    }

    .closeButton {
      ${flexbox()}
      width: 24px;
      height: 24px;
      color: var(--white);
    }
  }

  .tokenButton {
    ${buttonStyle}
    ${primaryButtonStyle}
    ${smButtonStyle}
    flex-direction: row-reverse;
    width: 100%;
    margin-top: 12px;

    &:first-of-type {
      margin-top: 0;
    }

    &::after {
      content: 'Import ';
      margin-right: 4px;
      font-weight: 500;
    }

    .token {
      display: none;
    }

    .rightIcon {
      ${posCenterY()}
      right: 16px;
    }
  }

  ${media(
    'minLaptop',
    css`
      position: absolute;
      width: min-content;
      bottom: calc(100% + 8px);
      right: 0;
      padding: 8px;
      border-radius: 4px;
      background-color: var(--white);
      box-shadow: 0px 4px 16px rgba(var(--realBlack-rgb), 0.16);

      .dropdownHeader {
        display: none;
      }

      .token {
        margin-left: 4px;
      }

      .tokenButton {
        ${textStyle('button', 3)}
        flex-direction: row;
        justify-content: space-between;
        min-width: 160px;
        width: 100%;
        padding: 4px;
        margin-top: 4px;
        border-radius: 4px;
        color: var(--gray-900);
        text-align: left;
        white-space: nowrap;
        background-color: var(--white);
        transition: 200ms;

        &:first-child {
          margin-top: 0;
        }

        &:hover {
          background-color: var(--gray-100);
        }

        &::after,
        &::before {
          display: none;
        }

        .token {
          display: flex;
          flex-shrink: 0;
          margin-left: 8px;
        }
      }
    `
  )}
`
