import styled from 'styled-components'

import { flexbox, gradient, posCenterY, textStyle } from 'newStyles/utils'

const StyledBalanceSection = styled.section`
  .title {
    ${textStyle('body', 2)}
    margin-bottom: 4px;
    font-weight: 700;
    color: var(--gray-500);
  }

  .detail {
    ${flexbox('flex-start')}
  }

  .detailItem {
    ${textStyle('title')}
    margin-left: 4px;

    &:first-child {
      margin-left: 0;
    }

    dd {
      ${flexbox('flex-start')}
      color: var(--black);
    }
  }

  .fiatValue {
    ${flexbox('flex-start')}

    .icon {
      color: var(--gray-500);
    }

    strong {
      ${textStyle('body', 2)}
      color: var(--gray-500);
    }
  }
`

export const StyledAvailableBalance = styled(StyledBalanceSection)`
  .content {
    margin: 16px 0;
  }

  .subtitle {
    ${textStyle('body', 4)}
    font-weight: 700;
    background-image: ${gradient(4)};
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .balanceList {
    margin-top: 8px;
  }

  .balanceItem {
    position: relative;
    padding: 16px;
    padding-left: 60px;
    margin-top: 8px;
    border: 1.5px solid var(--gray-200);
    border-radius: 6px;

    &:first-child {
      margin-top: 0;
    }

    dt {
      ${textStyle('body', 3)}

      .symbol {
      }

      .pcnt {
        margin-left: 4px;
        color: var(--gray-400);
      }
    }

    dd {
      ${flexbox('flex-start')}
      color: var(--gray-600);

      .amount {
        ${textStyle('body', 2)}
        font-weight: 700;
      }

      .fiatValue {
        margin-left: 4px;

        strong {
          ${textStyle('body', 2)}
          color: var(--gray-500);
        }
      }
    }
  }

  .tokenIcon {
    ${posCenterY()}
    left: 16px;
  }
`

export const StyledStakedBalance = StyledBalanceSection
