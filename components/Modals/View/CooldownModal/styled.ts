import styled from 'styled-components'

import { textStyle } from 'newStyles/utils'

import { ModalCompletePage, ModalPage } from 'components/Modals/shared'

export const StyledCooldownModalPage1 = styled(ModalPage)`
  .nextButton {
    margin-top: 40px;
  }
`

export const StyledCooldownModalPage3 = styled(ModalCompletePage)`
  .detail {
    margin-top: 24px;
    text-align: center;

    dt {
      ${textStyle('body', 2)}
      color: var(--gray-500);
    }

    dd {
      ${textStyle('subtitle', 1)}
      margin-top: 8px;
      color: rgba(var(--white-rgb), 0.9);
    }
  }

  .tilde {
    &::before {
      margin: 0 4px;
      content: '~';
    }
  }
`
