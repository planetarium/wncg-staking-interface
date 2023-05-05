import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { flexbox, inlineFlexbox, media, textStyle } from 'styles/utils'

export const StyledToast = styled.aside`
  ${textStyle('body', 3)}
  position: relative;

  .toastHeader {
    a {
      ${flexbox('between')}
      padding: 4px;
      margin: -4px;
      border-radius: 4px;
      transition: 200ms;

      &:hover {
        background-color: var(--gray-100);
      }
    }

    .loading {
      width: 16px;
      height: 16px;
      overflow: hidden;

      > div {
        width: 44px !important;
        height: 44px !important;
      }

      svg {
        max-width: unset;
        max-height: unset;
        width: 44px !important;
        height: 44px !important;
      }
    }
  }

  .title {
    ${flexbox('start')}
    ${textStyle('body', 3, 700)}
    color: var(--primary-500);

    .icon {
      color: var(--gray-400);
    }
  }

  .toastContent {
    margin-top: ${16 - 4}px;

    .desc {
      ${textStyle('body', 4)}
      color: var(--gray-500);
    }
  }

  .detailItem {
    ${flexbox('between', 'start')}
    ${textStyle('body', 4, 700)}
    margin-top: 8px;
    color: var(--gray-600);
    white-space: nowrap;

    &:first-child {
      margin-top: 0;
    }

    dt {
      ${flexbox('start')}
      flex-shrink: 0;
      margin-right: 8px;
    }

    dd {
      ${flexbox('start', 'end')}
      flex-grow: 1;
      flex-direction: column;
      text-align: right;
      overflow: hidden;

      .text {
        ${textStyle('body', 4)}
        font-weight: 500 !important;
        color: var(--gray-500);
      }

      .number {
        &:not(.usd) {
          display: block;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 700;

          span {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-weight: 700;
          }
        }
      }

      .usd {
        font-weight: 500;
        color: var(--gray-500);
      }
    }

    .token {
      ${flexbox('start')}
      margin-right: 4px;
    }

    .tokenIcon {
      width: 16px;
      height: 16px;
      margin-left: -4px;

      svg {
        width: 16px;
        height: 16px;
      }

      &:first-child {
        margin-left: 0;
      }
    }
  }

  .scheduleItem {
    ${flexbox('between')}
    ${textStyle('body', 4)}
    white-space: nowrap;
    margin-top: 10px;

    &:first-child {
      margin-top: 0;
    }

    dt {
      margin-right: 4px;
      flex-shrink: 0;
    }

    dd {
      font-weight: 700;
      color: var(--gray-600);
    }
  }

  .toastFooter {
    margin-top: 12px;

    button {
      margin-top: 8px;

      &:first-child {
        margin-top: 0;
      }
    }
  }

  ${media(
    'minLaptop',
    css`
      .toastHeader {
        margin-top: -4px;

        a {
          ${flexbox('between')}
          padding: 4px 8px;
          margin: -4px -8px;
        }
      }

      .title {
        ${textStyle('body', 2, 700)}
      }

      .toastContent {
        margin-top: ${20 - 4}px;

        .desc {
          ${textStyle('body', 3)}
        }
      }

      .detailItem {
        ${flexbox('between', 'start')}
        ${textStyle('body', 3, 700)}
        margin-top: 8px;
      }

      .toastFooter {
        margin-top: 16px;
      }
    `
  )}
`

export const StyledToastCloseButton = styled.button`
  position: absolute;
  display: none;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  border-radius: 20px;
  background-color: var(--primary-25);
  color: var(--primary-800);
  box-shadow: 0px 2px 2px rgba(var(--black-rgb), 0.16);
  cursor: pointer;

  .icon {
    width: 12px;
    height: 12px;
  }

  ${media(
    'minLaptop',
    css`
      ${flexbox()}
    `
  )}
`

export const StyledToastStatus = styled(motion.strong)<{ $success?: boolean }>`
  ${inlineFlexbox('start')}
  ${textStyle('body', 3, 700)}
  color: var(--error-400);

  ${media(
    'minLaptop',
    css`
      ${textStyle('body', 2, 700)}
    `
  )}

  ${({ $success }) =>
    $success &&
    css`
      color: var(--green-600);
    `}
`

export const StyledApproveToast = styled(StyledToast)`
  .detailItem {
    align-items: center;
    dt {
      ${textStyle('caption')}
      font-weight: 700;
    }

    dd {
      flex-grow: 0;
      width: 50%;
      overflow: hidden;
      margin-left: 8px;
      font-weight: 500 !important;

      .text,
      .number {
        ${textStyle('body', 4)}
        font-weight: 500 !important;
        color: var(--gray-500);
      }

      .number {
        span {
          display: block;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 500 !important;
        }
      }
    }
  }
`
