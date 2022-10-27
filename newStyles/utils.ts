import { css } from 'styled-components'
import hexRgb from 'hex-rgb'

import { colors, gradients } from './constants/colors'
import type { GradientType } from './constants/colors'
import {
  bodies,
  buttons,
  caption,
  displayHeaders,
  headers,
  number,
  subtitles,
  title,
} from './constants/typography'
import type { TextStyle } from './constants/typography'
import { assertUnreachable } from 'utils/assertion'

function hexToRgba(value: string) {
  return hexRgb(value, { format: 'css' })
    .replace(/rgb|\(|\)/g, '')
    .split(' ')
    .join(',')
}

// NOTE: Global variables
export function generateHexVariables() {
  return Object.entries(colors).map(([key, scales]) => {
    if (typeof scales === 'string') return `--${key}: ${scales};`
    return Object.entries(scales).map(
      ([scale, value]) => `--${key}-${scale}: ${value};`
    )
  })
}

export function generateRgbVariables() {
  return Object.entries(colors).map(([key, scales]) => {
    if (typeof scales === 'string') return `--${key}-rgb: ${hexToRgba(scales)};`
    return Object.entries(scales).map(
      ([scale, value]) => `--${key}-${scale}-rgb: ${hexToRgba(value)};`
    )
  })
}

// NOTE: Colors
export function gradient(type: GradientType) {
  return gradients[type]
}

// NOTE: Typography
export function header(level: 1 | 2 | 3 | 4 | 5 | 6) {
  return headers[level]
}

export function subtitle(level: 1 | 2) {
  return subtitles[level]
}

export function body(level: 1 | 2 | 3 | 4) {
  return bodies[level]
}

export function button(level: 1 | 2 | 3) {
  return buttons[level]
}

export function displayHeader(level: 1 | 2 | 3) {
  return displayHeaders[level]
}

export function textStyle(type: TextStyle, level?: any) {
  switch (type) {
    case 'header':
      return header(level)
    case 'title':
      return title
    case 'subtitle':
      return subtitle(level)
    case 'body':
      return body(level)
    case 'caption':
      return caption
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

type FlexboxValue =
  | 'center'
  | 'flex-end'
  | 'flex-start'
  | 'space-around'
  | 'space-between'
  | 'stretch'

export function flexbox(
  jc: FlexboxValue = 'center',
  ai: FlexboxValue = 'center'
) {
  return css`
    display: flex;
    align-items: ${ai};
    justify-content: ${jc};
  `
}

export function inlineFlexbox(
  jc: FlexboxValue = 'center',
  ai: FlexboxValue = 'center'
) {
  return css`
    display: inline-flex;
    justify-content: ${jc};
    align-items: ${ai};
  `
}

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

export function imageContainer(_width: string | number) {
  const width = typeof _width === 'string' ? _width : `${_width}px`

  return css`
    width: ${width};

    > span {
      position: unset !important;
    }

    img {
      object-fit: contain;
      width: 100% !important;
      position: relative !important;
      height: unset !important;
    }
  `
}
