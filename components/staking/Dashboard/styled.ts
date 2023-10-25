import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { fontFamily } from 'styles/constants/typography'
import {
  flexbox,
  inlineFlexbox,
  media,
  posCenterX,
  textStyle,
} from 'styles/utils'

export const StyledStakingDashboard = styled.section`
  .imageContainer {
    ${flexbox('start', 'start')}
    width: 144px;
    height: 144px;
    overflow: hidden;

    .image {
      max-height: 144px;

      img {
        max-height: 144px !important;
        transform: scale(1.25);
      }
    }
  }

  ${media(
    'minTablet',
    css`
      .imageContainer {
        justify-content: center;
        width: 320px;
        height: 320px;
        margin-right: auto;
        margin-left: auto;

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
    'minLaptop',
    css`
      ${flexbox('between')}
      flex-direction: column;
      height: 100%;

      .imageContainer {
        width: 336px;
        height: 336px;

        .image {
          max-height: 336px;

          img {
            max-height: 336px !important;
            transform: scale(1.44);
          }
        }
      }
    `
  )}

  ${media(
    'minDesktop',
    css`
      .imageContainer {
        width: 336px;
        height: 336px;

        .image {
          max-height: 336px;

          img {
            max-height: 336px !important;
            transform: scale(1.44);
          }
        }
      }
    `
  )}
`

export const StyledStakingDashboardApr = styled.dl<{
  $fallback?: boolean
}>`
  .aprItem {
    ${flexbox('start')}
    ${textStyle('body', 3)}
    position: relative;
    margin-top: 2px;
    color: var(--white);

    &.fallback {
      dt {
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
      }

      .tooltipGroup {
        width: 20px;
        height: 20px;
        /* margin-left: 4px; */
        margin-right: 4px;

        .toggler {
          display: flex;
          width: 20px;
          height: 20px;
          margin-left: 0;
          color: var(--gray-100);

          &:hover {
            + .tooltip {
              opacity: 1;
            }
          }
        }
      }

      .tooltip {
        ${textStyle('body', 3, 700)}
        opacity: 0;
        left: 0 !important;
        justify-content: flex-start;
        text-align: left;
        pointer-events: none;
        animation: none;
        transform: translate3d(0, 16px, 0);

        &::after {
          display: none;
        }

        .icon.warning {
          margin-right: 12px;
        }

        .closeButton {
          margin-left: 12px;
        }
      }

      .refreshButton {
        ${flexbox()}
        width: 20px;
        height: 20px;

        .icon {
          width: 20px;
          height: 20px;
        }
      }

      @keyframes floatTop {
        0% {
          transform: translate3d(0, 0, 0);
        }

        100% {
          transform: translate3d(0, 4px, 0);
        }
      }
    }

    &:first-child {
      margin-top: 0;
    }

    .tooltipGroup {
      flex-shrink: 0;
    }

    .toggler {
      display: none;
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

    .approx {
      &::before {
        font-family: ${fontFamily.text};
      }
    }

    dd {
      ${flexbox()}
    }
  }

  .aprHarvestButton {
    display: none;
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

        &.fallback {
          .tooltip {
            left: 50% !important;
            animation: floatTop 600ms infinite alternate
              cubic-bezier(0.215, 0.61, 0.355, 1);

            &::after {
              display: block;
            }
          }

          @keyframes floatTop {
            0% {
              transform: translate3d(-50%, 0, 0);
            }

            100% {
              transform: translate3d(-50%, 4px, 0);
            }
          }
        }

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
          position: relative;
          width: 100%;
          color: rgba(var(--white-rgb), 0.6);
        }

        dd:not(.buttonGroup) {
          height: 48px;
          margin-top: 8px;
        }

        .countUp {
          ${textStyle('number')}
          font-size: 2rem;
        }

        .tilde {
          &::before {
            font-family: ${fontFamily.text};
          }
        }

        .symbol {
          font-size: 1rem;
          font-weight: 700;
        }

        .toggler {
          display: flex;
        }
      }

      .aprHarvestButton,
      .retryButton {
        ${posCenterX()}
        top: calc(100% + 12px);
        display: flex;
      }

      .aprHarvestButton {
        width: 99px;
      }
    `
  )}
`

export const StyledStakingDashboardAprFallback = styled.div`
  .errorMsg {
    ${inlineFlexbox('start')}
    ${textStyle('body', 3)}
    margin-top: 20px;
    color: var(--primary-300);

    .icon {
      color: var(--white);
      margin-right: 8px;
    }

    .retryButton {
      margin-left: 16px;
    }
  }

  ${media(
    'minTablet',
    css`
      .errorMsg {
        ${flexbox()}

        br {
          display: none;
        }
      }
    `
  )}

  ${media(
    'minLaptop',
    css`
      .errorMsg {
        ${textStyle('body', 2)}
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
    left: auto !important;
    right: 0;

    &::after {
      display: none;
    }

    .title {
      ${textStyle('body', 3, 700)}
    }

    @keyframes floatTop {
      0% {
        transform: translate3d(0, 0, 0);
      }

      100% {
        transform: translate3d(0, 4px, 0);
      }
    }
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

      .symbol {
        ${textStyle('body', 4, 700)}
        margin-left: 2px;
      }
    }
  }

  .harvestButton {
    flex-shrink: 0;
    width: 99px;
    margin-left: 8px;
  }

  ${media(
    'minLaptop',
    css`
      display: block;
    `
  )}

  ${media(
    'minDesktop',
    css`
      .harvestTooltip {
        width: 400px;
        left: 50% !important;
        right: auto;

        @keyframes floatTop {
          0% {
            transform: translate3d(-50%, 0, 0);
          }

          100% {
            transform: translate3d(-50%, 4px, 0);
          }
        }
      }
    `
  )}
`
