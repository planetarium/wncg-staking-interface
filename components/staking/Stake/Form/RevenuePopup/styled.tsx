import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import {
  flexbox,
  media,
  scrollbar,
  textGradient,
  textStyle,
} from 'styles/utils'

export const StyledStakeFormRevenuePopupBonusRewards = styled(motion.aside)`
  ${scrollbar()}
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 1;
  padding: 20px;
  width: 100%;
  height: 240px;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: var(--primary-900);
  border-radius: 8px;
  box-shadow: -12px 12px 96px rgba(89, 0, 209, 0.5),
    16px 16px 96px rgba(30, 78, 84, 0.5);
  backdrop-filter: blur(24px);

  .header {
    ${flexbox('start')}

    .icon {
      margin-right: 4px;
      color: var(--primary-50);
    }

    .title {
      ${textStyle('body', 3, 700)}
      ${textGradient(3)}
    }
  }

  .content {
    margin-top: 16px;
  }

  .revenueItem {
    width: 100%;
    margin-top: 16px;

    &:first-child {
      margin-top: 0;
    }

    dt {
      ${textStyle('caption')}
      flex-shrink: 0;
      width: 200px;
      white-space: nowrap;
      font-weight: 700;
      color: var(--primary-300);

      time {
        margin-left: 8px;
        font-weight: 500;
        color: rgba(var(--white-rgb), 0.8);
      }
    }

    dd {
      ${flexbox('between')}
      width: 100%;
      margin-top: 8px;
    }

    .revenueGroup {
      width: calc(50% - 8px);

      .token {
        ${flexbox('start')}

        .tokenIcon {
          margin-right: 4px;
        }

        .countUp {
          ${textStyle('body', 4, 700)}
          color: var(--white);
        }
      }

      .fiatValue {
        ${textStyle('caption')}
        display: block;
        margin-top: 2px;
        color: rgba(var(--gray-25-rgb), 0.8);
      }
    }
  }

  ${media(
    'maxLaptop',
    css`
      display: none !important;
    `
  )}
`

export const StyledStakeFormRevenuePopupSingleRewards = styled(motion.aside)`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 10;
  padding: 24px;
  min-width: 720px;
  overflow: hidden;
  background-color: var(--primary-900);
  border-radius: 8px;
  box-shadow: -12px 12px 96px rgba(89, 0, 209, 0.5),
    16px 16px 96px rgba(30, 78, 84, 0.5);
  backdrop-filter: blur(24px);

  .header {
    ${flexbox('start')}

    .icon {
      margin-right: 4px;
      color: var(--blue-300);
    }

    .title {
      ${textStyle('body', 3)}
      ${textGradient(2)}
      font-weight: 700;
    }
  }

  .content {
    margin-top: 24px;
  }

  .revenueList {
    ${flexbox('between')}
  }

  .revenueItem {
    padding-left: 16px;

    &:first-child {
      padding-left: 0;
    }

    dt {
      ${textStyle('caption')}
      white-space: nowrap;
      font-weight: 700;
      color: var(--blue-300);

      .timestamp {
        margin-left: 8px;
        font-weight: 500;
        color: rgba(var(--gray-25-rgb), 0.5);
      }
    }

    .label {
      ${flexbox('start')}
      margin-top: 6px;

      .tokenIcon {
        margin-right: 4px;
      }

      .countUp {
        ${textStyle('body', 4)}
        font-weight: 700;
      }
    }

    .usd {
      ${textStyle('body', 4)}
      display: block;
      margin-top: 4px;
      color: rgba(var(--gray-25-rgb), 0.8);
    }
  }

  ${media(
    'maxLaptop',
    css`
      display: none !important;
    `
  )}
`
