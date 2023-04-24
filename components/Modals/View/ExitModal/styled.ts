import styled from 'styled-components'

import { CompletePage } from 'components/Modals/shared'
import { flexbox, textStyle } from 'styles/utils'

export const StyledExitModalPage2 = styled(CompletePage)`
  .detailList {
    margin-bottom: 16px;
  }

  .detailItem {
    margin-top: 16px;
    dt {
      ${flexbox('start')}

      .tokenIcon {
        margin-right: 8px;
      }
    }

    dd {
      ${flexbox('center', 'end')}
      ${textStyle('body', 3)}
      flex-direction: column;
      color: var(--primary-500);

      .number {
        font-weight: 700;
      }

      .fiatValue {
        .number {
          font-weight: 500;
        }
      }
    }
  }
`
