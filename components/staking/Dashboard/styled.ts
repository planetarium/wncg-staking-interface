import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { fontFamily } from 'styles/constants/typography'
import { flexbox, media, textStyle } from 'styles/utils'

export const StyledStakingDashboard = styled(motion.section)`
  .imageContainer {
    ${flexbox('start', 'start')}
    width: 100%;
    height: 144px;
    overflow: hidden;

    .image {
      max-height: 144px;

      img {
        max-height: 144px !important;
      }
    }
  }

  ${media(
    'minTablet',
    css`
      .imageContainer {
        justify-content: center;
      }
    `
  )}

  ${media(
    'minLaptop',
    css`
      ${flexbox('between')}
      flex-direction: column;
      height: 100%;

      .imageContainer {
        height: 320px;

        .image {
          max-height: 320px;

          img {
            max-height: 320px !important;
          }
        }
      }
    `
  )}

  ${media(
    'minDesktop',
    css`
      .imageContainer {
        height: 300px;

        .image {
          max-height: 300px;

          img {
            max-height: 300px !important;
          }
        }
      }
    `
  )}
`

type StyledDashboardAprProps = {
  $fallback?: boolean
}

export const StyledDashboardApr = styled(motion.dl)<StyledDashboardAprProps>`
  .aprItem {
    ${flexbox('start')}
    ${textStyle('body', 3)}
    margin-top: 2px;
    color: var(--white);

    &:first-child {
      margin-top: 0;
    }

    .tooltipGroup {
      flex-shrink: 0;
    }

    .toggler {
      display: none; // FIXME: 반응형 체크
      width: 16px;
      height: 16px;
      margin-left: 4px;
      color: var(--white);
    }

    dt {
      ${flexbox()}
      white-space: nowrap;
    }

    .symbol {
      margin-left: 0;
    }
  }

  ${({ $fallback }) =>
    $fallback &&
    css`
      min-height: 88px;
    `}

  ${media(
    'minTablet',
    css`
      ${flexbox()}
      margin-top: 16px;

      .aprItem {
        margin-top: 0;
        margin-left: 32px;

        &:first-child {
          margin-left: 0;
        }

        .countUp {
          font-weight: 500;
        }
      }
    `
  )}

  ${media(
    'minLaptop',
    css`
      ${flexbox()}
      margin-top: 64px;

      .colon::before {
        display: none;
      }

      .aprItem {
        ${flexbox()}
        flex-direction: column;
        margin-left: 50px;

        &:first-child {
          margin-left: 0;
        }

        dt {
          ${textStyle('body', 3)}
          color: rgba(var(--white-rgb), 0.6);
        }

        dd {
          margin-top: 8px;
        }

        .countUp {
          ${textStyle('number')}
          font-size: 2.5rem;
        }

        .symbol {
          font-family: ${fontFamily.digit};
          font-size: 2rem;
        }

        .toggler {
          display: flex;
        }
      }
    `
  )}
`

export const StyledStakingDashboardHarvest = styled(motion.div)`
  display: none;

  .harvestTooltip {
    display: block;
    padding: 28px;
    text-align: left;
    border-radius: 16px;
  }

  .tooltipHeader,
  .tooltipFooter {
    ${flexbox('between')}
    width: 100%;
    white-space: initial;
  }

  .tooltipHeader {
    align-items: flex-start;
    position: relative;

    .closeButton {
      ${flexbox()}
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      margin-left: 8px;
    }
  }

  .tooltipFooter {
    margin-top: 16px;

    .desc {
      ${textStyle('body', 4)}
      color: var(--gray-300)
    }

    .countUp {
      ${textStyle('body', 4, 700)}
      font-family: inherit;
    }
  }

  ${media(
    'minLaptop',
    css`
      display: block;
    `
  )}
`
