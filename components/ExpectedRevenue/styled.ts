import styled, { css } from 'styled-components'

import { flexbox, media, textStyle } from 'styles/utils'

type StyledExpectedRevenueProps = {
  $color?: string
}

const REVENUE_ITEM_PADDING = 16

export const StyledExpectedRevenue = styled.dl<StyledExpectedRevenueProps>`
  .revenueItem {
    ${textStyle('body', 3)}
    padding: 20px;
    margin-top: 16px;
    border-radius: 8px;
    background-color: rgba(var(--white-rgb), 0.05);

    &:first-child {
      margin-top: 0;
    }
  }

  dt {
    ${flexbox('between')}
    ${textStyle('body', 4, 700)}
    width: 100%;
    white-space: nowrap;
    color: var(--primary-300);

    time {
      ${textStyle('body', 4)}
      color: var(--gray-400);
    }
  }

  .value {
    width: 100%;
    margin-top: 12px;
  }

  .valueItem {
    ${flexbox('between')}
    width: 100%;
    margin-top: 2px;

    &:first-child {
      margin-top: 0;
    }
  }

  .label,
  .number {
    ${flexbox('start')}
    width: calc(50% - 4px);
    flex-shrink: 0;
    flex-grow: 0;
    overflow: hidden;
  }

  .countUp {
    ${textStyle('body', 4)}
    max-width: calc(100% - ${14 + 4}px);
    overflow: hidden;
    text-overflow: truncate;
  }

  .number {
    ${textStyle('body', 4, 700)}
    justify-content: flex-end;
    text-align: right;
    color: var(--white);
  }

  .tokenIcon {
    width: 14px;
    height: 14px;
    margin-right: 4px;
    flex-shrink: 0;

    svg {
      width: 14px;
      height: 14px;
    }
  }

  .label {
    /* ${flexbox('start')} */

    .token,
    .countUp {
      display: inline-flex !important;
    }
  }

  ${({ $color }) =>
    $color &&
    css`
      .countUp {
        color: ${$color};
      }
    `}

  ${media(
    'minSmLaptop',
    css`
      .revenueItem {
        /* ${flexbox('start')} */
        ${textStyle('body', 3)}
        padding: ${REVENUE_ITEM_PADDING}px 0;
        margin-top: 0;
        border-radius: 0;
        box-shadow: 0 1px 0 rgba(var(--gray-600-rgb), 0.5);
        background-color: transparent;

        &:last-child {
          box-shadow: none;
        }
      }

      dt {
        ${flexbox('start')}
        width: 100%;

        time {
          ${textStyle('body', 4)}
          margin-left: 8px;
          color: rgba(var(--white-rgb), 0.8);
        }
      }

      .value {
        ${flexbox('center', 'start')}
        margin-top: 8px;
      }

      .valueItem {
        ${flexbox('center', 'start')}
        flex-shrink: 0;
        flex-direction: column;
        width: 50%;
        margin-top: 0;
        text-align: left;

        &:first-child {
          margin-left: 0;
        }
      }

      .label,
      .number {
        ${flexbox('start')}
        width: 100%;
      }

      .label {
        .countUp {
          ${textStyle('body', 3, 700)}
        }
      }

      .number {
        ${textStyle('caption')}
        margin-top: 4px;
        color: rgba(var(--gray-25-rgb), 0.8);
      }

      .tokenIcon {
        margin-right: 4px;
      }
    `
  )}
`
