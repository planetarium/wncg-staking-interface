import type { CSSProperties } from 'react'
import styled from 'styled-components'

import config from 'config'

export const StyledCode = styled.pre`
  position: absolute;
  padding: 4px;
  background-color: rgba(var(--realBlack-rgb), 0.85);
  border-radius: 3px;

  code {
    width: 100%;
    white-space: pre-wrap;
    font-family: monospace;
    line-height: 1.4;
    font-weight: 700;
    font-size: 13px;
    color: var(--white);
  }
`

type CodeProps = {
  bottom?: number | string
  data?: any
  left?: number | string
  maxWidth?: number | string
  right?: number | string
  style?: CSSProperties
  z?: number
  top?: number | string
}

export default function Code({
  bottom,
  data,
  left,
  maxWidth = 200,
  z = 1000,
  right,
  style = {},
  top,
}: CodeProps) {
  if (config.env === 'production') return null

  style = { ...style, top, right, bottom, left, maxWidth, zIndex: z }

  let source = JSON.stringify(data, null, 2)
  if (typeof data === 'undefined') source = 'undefined'

  return (
    <StyledCode style={style}>
      <code>{source}</code>
    </StyledCode>
  )
}
