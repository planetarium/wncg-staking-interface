import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { assertUnreachable } from 'utils/assertUnreachable'
import {
  flexbox,
  gradient,
  inlineFlexbox,
  media,
  onArrowHover,
  posCenter,
  posCenterX,
  posCenterY,
  textGradient,
  textStyle,
} from 'styles/utils'
import { ALERT_HEIGHT } from 'styles/constants/dimensions'

import { StyledButton, buttonStyle } from './Button/styled'

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

export const StyledArrow = styled.span<{ $size: IconSize }>`
  position: relative;
  display: block;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;

  &:hover {
    ${onArrowHover()}
  }

  .icon {
    ${posCenter()}
    transition: 200ms;

    &.chevronLine {
      opacity: 0;
      transform: translate3d(-55%, -50%, 0);
    }

    &.chevron {
      transform: translate3d(-55%, -50%, 0);
    }
  }
`

export const StyledConnectorIcon = styled.span<{ $size: number }>`
  ${inlineFlexbox()}
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  overflow: hidden;
  border-radius: 50%;
  background-color: var(--white);

  .cryptoIcon {
    width: ${({ $size }) => `${$size * 0.8}px`};
    height: ${({ $size }) => `${$size * 0.8}px`};
  }
`

export const StyledCountUp = styled.strong`
  white-space: nowrap;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
  letter-spacing: inherit;
  line-height: inherit;
  transition: 150ms;

  .symbol {
    margin-left: 0.25em;
  }
`

export const StyledHighPriceImpact = styled(motion.div)`
  padding: 16px;
  background-image: ${gradient(2)};
  border-radius: 8px;

  .title {
    ${textStyle('body', 4, 700)}
  }

  .desc {
    ${textStyle('body', 4)}
    margin-top: 8px;
    color: rgba(var(--white-rgb), 0.9);
  }

  .checkboxGroup {
    ${flexbox('end')}
    width: 100%;
    margin-top: 12px;

    .label {
      ${textStyle('body', 4, 700)}
      margin-right: 8px;
      text-transform: capitalize;
    }

    .checkbox {
      width: 16px;
      height: 16px;
    }
  }

  ${media(
    'minLaptop',
    css`
      padding: 20px;

      .title {
        ${textStyle('body', 3, 700)}
      }

      .desc {
        ${textStyle('body', 4)}
      }

      .checkboxGroup {
        margin-top: 16px;

        .label {
          ${textStyle('body', 4, 700)}
          margin-right: 12px;
        }

        .checkbox {
          width: 24px;
          height: 24px;
        }
      }
    `
  )}
`

type StyledImageProps = {
  $objectFit: 'contain' | 'cover'
  $bg?: boolean
  $loaded?: boolean
}

export const StyledImage = styled.div<StyledImageProps>`
  ${flexbox()}
  position: relative;

  img {
    width: 100% !important;
    position: relative !important;
    height: unset !important;
    object-fit: ${({ $objectFit }) => $objectFit};
    transition: 300ms;
    opacity: 0;
  }

  ${({ $bg }) =>
    $bg &&
    css`
      pointer-events: none;
      user-select: none;
    `}

  ${({ $loaded: $loadComplete }) =>
    $loadComplete &&
    css`
      img {
        opacity: 1;
      }
    `}
`

export const StyledImportToken = styled(StyledButton)`
  .label {
    font-weight: 500 !important;

    strong {
      font-weight: 700;
      margin-left: 0.3em;
    }
  }
`

export const StyledLayout = styled.div`
  width: 100%;
  max-width: 100vw;
  height: 100vh;
  max-height: -webkit-fill-available;
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
  max-height: -webkit-fill-available;
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

export const StyledNumberFormat = styled.strong`
  ${inlineFlexbox()}
  font-size: inherit;
  font-weight: 500;
  color: inherit;
  letter-spacing: inherit;
  line-height: inherit;
  transition: 150ms;
`

export const StyledRektPriceImpact = styled(motion.aside)`
  ${flexbox()}
  padding: 10px 16px;
  color: var(--white);
  background-color: var(--error-400);
  border-radius: 8px;

  .title {
    ${textStyle('body', 4, 700)}
  }

  .icon {
    flex-shrink: 0;
    margin-right: 12px;
  }

  ${media(
    'minLaptop',
    css`
      padding: 16px;

      .title {
        ${textStyle('body', 3, 700)}
      }
    `
  )}
`

export const StyledSkeleton = styled(motion.div)<{
  $type: 'light' | 'dark' | 'medium'
}>`
  ${flexbox('start')}
  flex-shrink: 0;

  span {
    display: block;
    width: 100%;
    animation: skeletonLoading 2s ease-in-out infinite;
    background-size: 200% 200%;
    background-image: ${({ $type }) =>
      $type === 'light'
        ? `linear-gradient(90deg, rgba(234, 240, 247, 0.4) 0%, #dce4ed 50%, rgba(234, 240, 247, 0.4) 100%)`
        : $type === 'medium'
        ? `linear-gradient(90deg, rgba(var(--white-rgb), 0.08) 0%, rgba(var(--white-rgb), 0.12) 100%)`
        : `linear-gradient(90deg, rgba(33, 35, 34, 0.1) 0%, rgba(33, 35, 34, 0.5) 100%)`};
  }

  @keyframes skeletonLoading {
    0% {
      background-position: 0% 51%;
    }

    100% {
      background-position: -200% 0;
    }
  }
`

export const StyledSlippageDropdown = styled.div`
  ${flexbox('start')}
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

export const StyledIcon = styled.svg<{ $size: IconSize }>`
  ${inlineFlexbox()}
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
`

export const StyledCryptoIcon = styled.svg<{ $size: number }>`
  ${inlineFlexbox()}
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  border-radius: 50%;
`

export const StyledPoolTokens = styled.div`
  .header {
    position: relative;
    width: 100%;
    color: var(--gray-500);

    a {
      ${flexbox('between')}
      padding: 4px 8px;
      margin: -4px -8px;
      border-radius: 4px;
      transition: 200ms;

      &:hover {
        background-color: var(--gray-100);

        .tooltip {
          opacity: 1;
        }
      }
    }

    .title {
      ${flexbox('start')}
      ${textStyle('body', 4, 700)}
      ${textGradient(4)}
    }

    .tooltipGroup {
      ${flexbox()}
    }

    .tooltip {
      ${textStyle('caption')}
      position: absolute;
      bottom: calc(100% + ${4 + 4}px);
      right: -8px;
      padding: 4px 6px;
      font-size: 0.625rem;
      color: var(--white);
      white-space: nowrap;
      border-radius: 2px;
      background-color: var(--gray-700);
      opacity: 0;
      transition: 200ms;
      will-change: opacity;
    }
  }

  .poolTokensList {
    ${flexbox('start', 'start')}
    flex-direction: column;
    width: 100%;
    margin-top: 8px;
  }

  .poolTokensItem {
    position: relative;
    width: 100%;
    padding: 16px;
    padding-left: 60px;
    margin-top: 8px;
    background-color: var(--white);
    border: 1.5px solid var(--gray-200);
    box-shadow: 0 0 0.5px var(--gray-200);
    border-radius: 6px;

    &:first-child {
      margin-top: 0;
    }

    .tokenIcon {
      ${posCenterY()}
      left: 16px;
    }

    dt {
      ${textStyle('body', 3)}

      .symbol {
        color: var(--gray-900);
      }

      .pcnt {
        margin-left: 4px;
        color: var(--gray-400);
      }
    }

    dd {
      ${flexbox('start')}
      ${textStyle('body', 2)}
      flex-wrap: wrap;
      margin-top: 2px;
      color: var(--gray-600);

      .tokenAmount {
        margin-right: 4px;
        font-weight: 700;
      }

      .fiatValue {
        color: var(--gray-500);
      }
    }
  }
`

export const StyledTokenIcon = styled.span<{ $size: number }>`
  ${flexbox()}
  flex-shrink: 0;
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  overflow: hidden;
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

export const StyledTokenIconGroup = styled.span<{
  $size: number
  $reverse: boolean
}>`
  ${inlineFlexbox('start')}
  flex-shrink: 0;
  height: ${({ $size }) => $size}px;

  ${({ $reverse, $size }) =>
    $reverse
      ? css`
          flex-direction: row-reverse;

          .icon {
            position: relative;
            margin-right: -${$size / 4}px;

            &:first-child {
              position: relative;
              margin-right: 0;
            }

            &:last-child {
              margin-left: 0 !important;
            }
          }
        `
      : css`
          .icon {
            margin-left: -${$size / 4}px;

            &:first-child {
              position: relative;
              margin-left: 0 !important;
            }
          }
        `}
`

export const StyledTooltip = styled.p<{
  $align: 'center' | 'left' | 'right'
  $direction: 'top' | 'right' | 'bottom' | 'left'
  $float: boolean
  $gap: number
  $width: number | 'auto' | 'initial'
  $noWrap: boolean
  $clickable: boolean
}>`
  ${flexbox()}
  ${textStyle('body', 4)}
  z-index: -1;
  width: ${({ $width }) => ($width === 'auto' ? $width : `${$width}px`)};
  padding: 12px 16px;
  font-weight: 700;
  color: var(--gray-300);
  text-align: ${({ $align }) => $align};
  border-radius: 8px;
  background-color: var(--gray-700);
  mix-blend-mode: normal;
  box-shadow: 0px 4px 48px rgba(0, 0, 0, 0.48);
  transition: 200ms;
  opacity: 0;

  a {
    text-decoration: underline;
  }

  .closeButton {
    ${inlineFlexbox()}
    width: 16px;
    height: 16px;
    margin-left: 8px;
    color: var(--white);
  }

  ${({ $noWrap }) =>
    $noWrap &&
    css`
      white-space: nowrap;
    `}

  ${({ $clickable }) =>
    $clickable &&
    css`
      &:hover {
        ${onArrowHover()}
      }

      cursor: pointer;
    `};

  ${({ $direction, $gap }) => {
    switch ($direction) {
      case 'top':
        return css`
          ${posCenterX()}
          bottom: calc(100% + ${$gap}px);
        `
      case 'right':
        return css`
          ${posCenterY()}
          left: calc(100% + ${$gap}px);
        `
      case 'bottom':
        return css`
          ${posCenterX()}
          top: calc(100% + ${$gap}px);
        `
      case 'left':
        return css`
          ${posCenterY()}
          right: calc(100% + ${$gap}px);
        `
      default:
        assertUnreachable($direction)
    }
  }}

  ${({ $direction, $float }) =>
    $float &&
    css`
      ${textStyle('body', 4, 700)}
      z-index: auto;
      font-weight: 700;
      color: var(--white);
      text-align: center;
      border-radius: 8px;
      background-image: linear-gradient(
        90deg,
        var(--primary-600) 0%,
        var(--primary-700) 100%
      );
      transform: translate(-50%, 0);
      opacity: 1;
      visibility: visible;
      user-select: none;
      animation: ${$direction === 'top' ? 'floatTop' : 'floatBottom'} 600ms
        infinite alternate cubic-bezier(0.215, 0.61, 0.355, 1);
      transition: 150ms;

      &::after {
        ${posCenterX()}
        top: ${$direction === 'top' ? '98%' : 'auto'};
        bottom: ${$direction === 'bottom' ? '98%' : 'auto'};
        width: 0;
        height: 0;
        border-top: 14px solid
          ${$direction === 'top' ? '#4c17b1' : 'transparent'};
        border-right: 14px solid transparent;
        border-bottom: 14px solid
          ${$direction === 'bottom' ? '#4c17b1' : 'transparent'};
        border-left: 14px solid transparent;
        content: '';
      }

      ${media(
        'minLaptop',
        css`
          ${textStyle('body', 2, 700)}
        `
      )}
    `}

  @keyframes floatTop {
    0% {
      transform: translateY(0);
    }

    100% {
      transform: translateY(4px);
    }
  }

  @keyframes floatBottom {
    0% {
      transform: translateY(0);
    }

    100% {
      transform: translateY(-4px);
    }
  }
`
