import styled from 'styled-components'

import {
  StyledModalCompletePage,
  StyledModalContent,
} from 'new/Modals/shared/styled'

export const StyledStakeModalPage3 = styled(StyledModalContent)`
  max-width: 720px;

  .subtitle {
    .amount {
      color: var(--primary-300);
    }

    .usdValue {
      margin-left: 0.25em;
    }
  }
`
