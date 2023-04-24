import { css, FlattenSimpleInterpolation } from 'styled-components'
import hexRgb from 'hex-rgb'

import { colors, gradients } from './constants/colors'
import { devices, DeviceSizeType } from './constants/devices'
import {
  bodies,
  buttons,
  caption,
  displayHeaders,
  headers,
  number,
  subtitles,
  title,
  TextStyle,
  fontFamily,
} from './constants/typography'
import { assertUnreachable } from 'utils/assertUnreachable'

// CSS variables
export function generateHexVariables() {
  return Object.entries(colors).map(([key, scales]) => {
    if (typeof scales === 'string') return `--${key}: ${scales};`
    return Object.entries(scales).map(
      ([scale, value]) => `--${key}-${scale}: ${value};`
    )
  })
}

function hexToRgba(value: string) {
  return hexRgb(value, { format: 'css' })
    .replace(/rgb|\(|\)/g, '')
    .split(' ')
    .join(',')
}

export function generateRgbVariables() {
  return Object.entries(colors).map(([key, scales]) => {
    if (typeof scales === 'string') return `--${key}-rgb: ${hexToRgba(scales)};`
    return Object.entries(scales).map(
      ([scale, value]) => `--${key}-${scale}-rgb: ${hexToRgba(value)};`
    )
  })
}

// Colors
export function gradient(type: 1 | 2 | 3 | 4 | 5 | 6) {
  return gradients[type]
}

// Text styles
export function header(level: 1 | 2 | 3 | 4 | 5 | 6) {
  return {
    ...headers[level],
    fontFamily: fontFamily.text,
    fontWeight: 700,
  }
}

export function subtitle(level: 1 | 2) {
  return subtitles[level]
}

export function body(level: 1 | 2 | 3 | 4, weight: 500 | 700) {
  return {
    ...bodies[level],
    fontFamily: fontFamily.text,
    fontWeight: weight,
  }
}

export function button(level: 1 | 2 | 3) {
  return {
    ...buttons[level],
    fontFamily: fontFamily.text,
    fontWeight: 700,
    textAlign: 'center',
  }
}

export function displayHeader(level: 1 | 2 | 3) {
  return {
    ...displayHeaders[level],
    fontFamily: fontFamily.display,
    fontWeight: 900,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  }
}

export function textStyle(
  type: TextStyle,
  level?: any,
  weight: 500 | 700 = 500
) {
  switch (type) {
    case 'header':
      return header(level)
    case 'title':
      return title
    case 'subtitle':
      return subtitle(level)
    case 'body':
      return body(level, weight)
    case 'caption':
      return {
        ...caption,
        fontWeight: weight,
      }
    case 'button':
      return button(level)
    case 'display':
      return displayHeader(level)
    case 'number':
      return number
    default:
      assertUnreachable(type)
  }
}

// Flexbox
type FlexboxValueOriginal =
  | 'center'
  | 'flex-end'
  | 'flex-start'
  | 'space-around'
  | 'space-between'
  | 'stretch'

type FlexboxValueAbbreviation =
  | 'center'
  | 'end'
  | 'start'
  | 'around'
  | 'between'
  | 'stretch'

type FlexboxValue = FlexboxValueOriginal | FlexboxValueAbbreviation

function flexValue(value: FlexboxValue) {
  switch (value) {
    case 'center':
      return 'center'
    case 'end':
    case 'flex-end':
      return 'flex-end'
    case 'start':
    case 'flex-start':
      return 'flex-start'
    case 'around':
    case 'space-around':
      return 'space-around'
    case 'between':
    case 'space-between':
      return 'space-between'
    case 'stretch':
      return 'stretch'
    default:
      assertUnreachable(value)
  }
}

export function flexbox(
  jc: FlexboxValue = 'center',
  ai: FlexboxValue = 'center'
) {
  return css`
    display: flex;
    align-items: ${flexValue(ai)};
    justify-content: ${flexValue(jc)};
  `
}

export function inlineFlexbox(
  jc: FlexboxValue = 'center',
  ai: FlexboxValue = 'center'
) {
  return css`
    display: inline-flex;
    justify-content: ${flexValue(jc)};
    align-items: ${flexValue(ai)};
  `
}

// Position
type PositionType = 'absolute' | 'fixed'

export function posCenterX(type: PositionType = 'absolute') {
  return css`
    position: ${type};
    left: 50%;
    transform: translateX(-50%);
  `
}

export function posCenterY(type: PositionType = 'absolute') {
  return css`
    position: ${type};
    top: 50%;
    transform: translateY(-50%);
  `
}

export function posCenter(type: PositionType = 'absolute') {
  return css`
    position: ${type};
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `
}

// Media query
export function media(type: DeviceSizeType, style: FlattenSimpleInterpolation) {
  return css`
    @media screen and (${devices[type]}) {
      ${style}
    }
  `
}

// Scrollbar
export function scrollbar(width = 6, padding = 10) {
  return css`
    scrollbar-width: thin;
    width: calc(100% + ${padding}px);
    padding-right: ${padding}px !important;
    margin-right: -${padding}px;
    overflow-x: hidden;
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: block;
      width: ${width}px;
      background-color: rgba(0, 0, 0, 0);
    }

    &::-webkit-scrollbar-button {
      display: none;
    }

    &::-webkit-scrollbar-track {
      background-color: rgba(0, 0, 0, 0);
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(var(--white-rgb), 0.8);
      border-radius: 8px;
    }
  `
}

export function scrollbarX(height = 6, padding = 10) {
  return css`
    scrollbar-width: thin;
    padding-bottom: ${padding}px !important;
    margin-bottom: -${padding}px;
    overflow-x: auto;
    overflow-y: hidden;

    &::-webkit-scrollbar {
      display: block;
      height: ${height}px;
      background-color: transparent;
    }

    &::-webkit-scrollbar-button {
      display: none;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(var(--black-rgb), 0.4);
      border-radius: 8px;
    }
  `
}

// Text gradient
export function textGradient(type: 1 | 2 | 3 | 4 | 5 | false) {
  if (!type) {
    return css`
      background-image: none;
      -webkit-background-clip: initial;
      background-clip: initial;
      -webkit-text-fill-color: unset;
    `
  }

  return css`
    background-image: ${gradient(type)};
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  `
}

export function onArrowHover() {
  return css`
    .icon {
      &.chevron {
        transform: translate3d(-45%, -50%, 0);
      }

      &.chevronLine {
        opacity: 1;
        transform: translate3d(-50%, -50%, 0);
      }
    }
  `
}
