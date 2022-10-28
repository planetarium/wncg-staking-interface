import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { flexbox, gradient, inlineFlexbox, textStyle } from 'newStyles/utils'
import { ALERT_HEIGHT, GLOBAL_FOOTER_HEIGHT } from './constants'

import { buttonStyle } from './Button/styled'

export type SvgIconSize = 16 | 24 | 32 | 48 | 64

export const StyledAlert = styled(motion.aside)`
  ${flexbox()}
  position: fixed;
  top: 0;
  left: 0;
  flex-shrink: 0;
  width: 100%;
  height: ${ALERT_HEIGHT}px;
  color: var(--white);
  background-color: var(--error-400);

  h2 {
    ${textStyle('body', 2)}
    margin: 0 12px;
    font-weight: 700;
  }

  .switchButton {
    ${buttonStyle}
    ${textStyle('caption')}
    width: auto;
    padding: 8px 16px;
    font-weight: 700;
    color: var(--orange-500);
    background-color: var(--white);
    border-radius: 100px;
  }
`

export const StyledConnectorIcon = styled.span<{ $size: SvgIconSize }>`
  ${inlineFlexbox()}
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  overflow: hidden;
  border-radius: 50%;
  background-color: var(--white);
`

export const StyledGlobalFooter = styled.footer`
  ${flexbox()}
  width: 100%;
  height: ${GLOBAL_FOOTER_HEIGHT}px;
  color: var(--gray-300);
  background-color: rgba(var(--white-rgb), 0.05);

  .container {
    ${flexbox('space-between')}
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
  }

  .content {
    ${flexbox('flex-start')}

    h5 {
      ${flexbox('flex-start')}
      ${textStyle('body', 4)}
      margin-right: 24px;

      strong {
        margin-right: 8px;
      }
    }

    a {
      ${inlineFlexbox()}
      ${textStyle('body', 4)}
      padding: 8px;
      margin-right: 16px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .buttonGroup {
    ${flexbox('flex-end')}
  }

  .snsButton {
    ${flexbox()}
    width: 48px;
    height: 48px;
    /* color: var(--gray-300); */
    border-radius: 50%;
    margin-left: 12px;

    &:first-child {
      margin-left: 0;
    }
  }
`

export const StyledHighPriceImpact = styled(motion.div)`
  padding: 24px 32px;
  background-image: ${gradient(2)};
  border-radius: 8px;

  .title {
    ${textStyle('body', 1)}
    font-weight: 700;
  }

  .desc {
    ${textStyle('body', 2)}
    margin-top: 8px;
  }

  .checkboxGroup {
    ${flexbox('flex-end')}
    width: 100%;
    margin-top: 24px;

    .label {
      ${textStyle('body', 2)}
      margin-right:12px;
      font-weight: 700;
      text-transform: capitalize;
    }

    .check {
      color: var(--white) !important;
    }
  }
`

export const StyledLayout = styled.div`
  width: 100%;
  max-width: 100vw;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
`

export type StyledMainProps = {
  $shrink: boolean
}

export const StyledMain = styled(motion.main)<StyledMainProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  transition: 500ms;
  overflow: hidden;
  background-color: var(--primary-900);

  ${({ $shrink }) =>
    $shrink &&
    css`
      max-height: calc(100vh - ${ALERT_HEIGHT}px);
    `}

  .gnb,
  .globalFooter {
    flex-shrink: 0;
  }

  .content {
    flex-grow: 1;
    overflow: auto;
  }
`

export const StyledRektPriceImpact = styled(motion.aside)`
  ${flexbox()}
  padding: 16px;
  color: var(--white);
  background-color: var(--error-400);
  border-radius: 8px;

  .title {
    ${textStyle('body', 2)}
    font-weight: 700;
  }

  .icon {
    flex-shrink: 0;
    margin-right: 12px;
  }
`

export const StyledSlippageDropdown = styled.div`
  ${flexbox('flex-start')}
  ${textStyle('body', 3)}

  strong {
    font-weight: 500;
    color: rgba(var(--white-rgb), 0.6);

    &::after {
      content: ':';
      margin-right: 4px;
      margin-left: 2px;
    }
  }
`

export const StyledSvgIcon = styled.svg<{ $size: SvgIconSize }>`
  ${inlineFlexbox()}
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
`

export const StyledTokenIcon = styled.span<{ $size: number }>`
  ${flexbox()}
  flex-shrink: 0;
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  border-radius: 50%;

  &.placeholder {
    background-color: var(--primary-500);
  }

  img,
  svg {
    width: ${({ $size }) => `${$size}px`};
    height: ${({ $size }) => `${$size}px`};
  }
`
