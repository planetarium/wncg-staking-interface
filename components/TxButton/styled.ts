import styled, { css } from 'styled-components'

import { StyledButton } from 'components/Button/styled'
import { flexbox, media, posCenterY } from 'styles/utils'

export const StyledTxButton = styled(StyledButton)`
  .leftIcon,
  .rightIcon {
    ${flexbox()}
    position: static;
    width: 32px;
    height: 32px;
  }

  .leftIcon {
    left: ${({ $size }) => ($size === 'lg' ? 24 : 16)}px;
    margin-right: 8px;
  }

  .rightIcon {
    right: ${({ $size }) => ($size === 'lg' ? 24 : 16)}px;

    .icon {
      width: 20px;
      height: 20px;
      margin: 0;
    }
  }

  ${media(
    'minSmLaptop',
    css`
      .leftIcon,
      .rightIcon {
        ${posCenterY()}
        margin: 0;
      }
    `
  )}
`
