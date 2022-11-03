import styled from 'styled-components'

import { flexbox, textStyle } from 'newStyles/utils'

export const StyledEarningsEstimate = styled.ul`
  li {
    margin-top: 16px;

    &:first-child {
      margin-top: 0;
    }
  }
`

export const StyledEarningsEstimateItem = styled.dl`
  ${flexbox('flex-end')}
  padding: 24px 32px;
  background-color: rgba(var(--white-rgb), 0.05);
  border-radius: 8px;

  .date {
    flex-grow: 1;

    dt {
      ${textStyle('body', 4)}
      font-weight: 700;
      line-height: 20px;
      color: var(--primary-300);
      user-select: none;
    }

    dd {
      ${textStyle('body', 1)}
      margin-top: 8px;
      font-weight: 700;
    }
  }

  .estimate {
    flex-shrink: 0;
    min-width: 180px;
    padding-left: 32px;
    white-space: nowrap;

    dd {
      ${flexbox('flex-end')}
      text-align: right;
    }
  }

  .amount {
    ${textStyle('body', 3)}

    .tokenIcon {
      flex-shrink: 0;
      margin-right: 4px;
    }
  }

  .usd {
    ${textStyle('subtitle', 1)}
    margin-top: 8px;
    font-weight: 700;
  }
`
