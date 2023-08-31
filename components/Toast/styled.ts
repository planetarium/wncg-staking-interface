import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { flexbox, inlineFlexbox, media, textStyle } from 'styles/utils'

export const StyledToast = styled.aside`
  ${textStyle('body', 3)}
  position: relative;

  .toastHeader {
    margin-top: -4px;

    a {
      ${flexbox('between')}
      padding: 4px 8px;
      margin: -4px -8px;
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
    margin-top: 16px;

    .desc {
      ${textStyle('body', 3)}
      color: var(--gray-500);
    }
  }

  .detailList {
    ${flexbox('start', 'start')}
    flex-direction: column;

    &.reverse {
      flex-direction: column-reverse;

      .detailItem {
        margin-top: 8px;

        &:last-child {
          margin-top: 0;
        }
      }
    }
  }

  .detailItem {
    ${flexbox('between', 'start')}
    ${textStyle('body', 3, 700)}
    width: 100%;
    margin-top: 8px;
    color: var(--gray-600);
    white-space: nowrap;

    &:first-child {
      margin-top: 0;
    }

    dt {
      ${flexbox('start')}
      margin-right: 8px;
      flex-shrink: 0;
    }

    &:has(.text) {
      align-items: center;
    }

    dd {
      ${flexbox('start', 'end')}
      flex-direction: column;
      flex-grow: 1;
      margin-top: 2px;
      overflow: hidden;
      text-align: right;

      &.allowance,
      &.text {
        margin-top: 0;
        font-weight: 500 !important;
        color: var(--gray-500) !important;

        * {
          font-weight: 500 !important;
          color: var(--gray-500) !important;
        }
      }

      &.text {
        margin-top: 0;
      }

      .number {
        display: block;
        font-weight: 700;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        span {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .usd,
      .fiatValue {
        ${flexbox('end')}
        font-weight: 500;
        color: var(--gray-500);
      }
    }

    .tokenIcon {
      margin-right: 4px;

      .tokenFragment {
        margin-left: -8px !important;

        &:first-child {
          margin-left: 0 !important;
        }
      }
    }
  }

  .pending {
    ${textStyle('body', 4)}
    color: var(--gray-400);
  }

  .scheduleList {
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
    margin-top: 16px;

    .importButton {
      margin-top: 8px;

      &:first-child {
        margin-top: 0;
      }
    }
  }

  ${media(
    'minLaptop',
    css`
      .title {
        ${textStyle('body', 2, 700)}
      }

      .toastContent {
        margin-top: 20px;
      }
    `
  )}
`

export const StyledToastCloseButton = styled.button`
  ${flexbox()}
  position: absolute;
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
`

export const StyledToastStatus = styled(motion.strong)<{ $success?: boolean }>`
  ${inlineFlexbox('start')}
  ${textStyle('body', 3, 700)}
  color: var(--error-400);

  ${({ $success }) =>
    $success &&
    css`
      color: var(--green-600);
    `}

  ${media(
    'minLaptop',
    css`
      ${textStyle('body', 2, 700)}
    `
  )}
`
