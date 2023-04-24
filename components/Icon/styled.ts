import styled from 'styled-components'

import { inlineFlexbox } from 'styles/utils'

export type IconSize = 16 | 24 | 32

type StyledIconProps = {
  $size: number
}

export const StyledIcon = styled.svg<StyledIconProps>`
  ${inlineFlexbox()}
  flex-shrink: 0;
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
`
