import styled, { css } from 'styled-components'

import { flexbox, media, posCenterY } from 'styles/utils'

import { StyledButton } from 'components/Button/styled'

export const StyledTxButton = styled(StyledButton)`
  .leftIcon,
  .rightIcon {
    ${flexbox()}
    position: relative;
    z-index: 1;
    width: 32px;
    height: 32px;
    opacity: 1;
  }

  .leftIcon {
    margin-right: 8px;
  }

  .rightIcon {
    margin-left: 8px;

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

      .leftIcon {
        left: 16px;
      }

      .rightIcon {
        right: 16px;
      }
    `
  )}
`
