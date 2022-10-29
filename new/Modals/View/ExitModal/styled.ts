import styled from 'styled-components'

import {
  StyledModalCompletePage,
  StyledModalContent,
} from 'new/Modals/shared/styled'

export const StyledExitModalPage2 = styled(StyledModalContent)`
  max-width: 720px;

  .title {
  }

  .subtitle {
    .amount,
    .amounts {
      display: block;
      color: var(--primary-300);
    }

    .usdValue {
      margin-left: 0.25em;
    }
  }

  .desc {
    span {
      &:last-child::after {
        display: none;
      }

      &::after {
        content: '/';
        margin: 0 4px;
      }
    }
  }
`

export const StyledExitModalPage3 = styled(StyledModalCompletePage)``
