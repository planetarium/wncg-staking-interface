import styled from 'styled-components'

import { CompletePage, ModalPage } from 'components/Modals/shared'
import { flexbox } from 'styles/utils'

export const StyledUnstakeModalPage1 = styled(ModalPage)`
  .modalHeader {
    .title {
      ${flexbox('start')}

      .icon {
        margin-right: 4px;
      }
    }
  }

  .revenueList {
    margin-top: -16px;
    margin-bottom: -16px;
  }
`

export const StyledUnstakeModalPage3 = styled(CompletePage)``
