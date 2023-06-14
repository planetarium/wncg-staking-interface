import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import {
  flexbox,
  media,
  onArrowHover,
  posCenter,
  textGradient,
  textStyle,
} from 'styles/utils'
import {
  buttonStyle,
  lgButtonStyle,
  mdButtonStyle,
} from 'components/Button/styled'

export const StyledStakingStake = styled(motion.section)`
  ${flexbox('start', 'start')}
  flex-direction: column;
  height: 100%;
  margin-top: 16px;

  .stakeGroup {
    width: 100%;
    margin-top: 32px;
  }

  .linkGroup {
    ${flexbox()}
    position: relative;
    width: 100%;
    margin-top: 4px;
  }

  .linkButton {
    ${buttonStyle}
    ${textStyle('button', 2)}
    width: 100%;
    max-width: 400px;
    height: 48px;
  }

  ${media(
    'minTablet',
    css`
      align-items: center;
      margin: 64px auto 0;

      .stakeGroup {
        margin-top: 64px;
      }
    `
  )}

  ${media(
    'minLaptop',
    css`
      align-items: flex-start;
      margin-top: 0;

      .stakeGroup {
        margin-top: 96px;
      }

      .linkGroup {
        margin-top: 8px;

        &.tooltipGroup {
          margin-top: 16px;
        }
      }
    `
  )}

  ${media(
    'minDesktop',
    css`
      .linkGroup {
        max-width: 580px;
      }
    `
  )}
`

export const StyledStakeFallback = styled(motion.div)`
  ${flexbox('between')}
  width: 100%;

  .group {
    width: 560px;
    height: 72px;
  }

  .submitButton {
    width: 120px !important;
  }

  ${media(
    'minDesktop',
    css`
      .submitButton {
        width: 144px !important;
      }
    `
  )}

  ${media(
    'minDesktop',
    css`
      .submitButton {
        width: 160px !important;
      }
    `
  )}
`

export const StyledStakeHeader = styled.header`
  position: relative;
  width: 100%;
  margin-top: 32px;

  .title {
    ${textStyle('display', 5)}
    ${textGradient(3)}
    color: var(--white);
  }

  .effectGroup {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .effect {
    position: absolute;
    animation: blink 1000ms infinite alternate;

    &::before,
    &::after {
      ${posCenter()}
      content: '';
    }

    &.large {
      width: 50%;
      height: 37px;
      transform: translateY(50%);

      &::before {
        width: 100%;
        height: ${18 / 3}px;
      }

      &::after {
        width: ${40 * 1.5}px;
        height: ${18 / 3}px;
        transform: translate(-50%, -50%) rotate(-90deg);
      }
    }

    &.small {
      width: 30%;
      height: 37px;
      transform: translateY(40%);

      &::before {
        width: 100%;
        height: ${(14 * 2) / 3}px;
      }

      &::after {
        width: 100%;
        height: ${(14 * 2) / 3}px;
        transform: translate(-50%, -50%) rotate(-90deg);
      }
    }

    &.lightBlue {
      top: 0;
      left: 0;
      animation-delay: 300ms;

      &::before {
        background-image: radial-gradient(
          31.3% 31.36% at 50% 50%,
          rgba(115, 255, 247, 0.24) 0%,
          rgba(115, 196, 255, 0.275) 48.44%,
          rgba(73, 157, 255, 0) 100%
        );
        opacity: 0.8;
      }

      &::after {
        background-image: radial-gradient(
          31.3% 31.36% at 50% 50%,
          rgba(115, 255, 247, 0.24) 0%,
          rgba(115, 196, 255, 0.275) 48.44%,
          rgba(73, 157, 255, 0) 100%
        );
      }
    }

    &.lightGray {
      top: 37px;
      left: 0;
      transform: translate(-50%, 50%);
      animation-delay: 700ms;

      &::before {
        background-image: radial-gradient(
          31.3% 31.36% at 50% 50%,
          rgba(255, 255, 255, 0.5) 0%,
          rgba(255, 255, 255, 0.18) 54.78%,
          rgba(235, 176, 119, 0) 100%,
          rgba(255, 255, 255, 0) 100%
        );
      }

      &::after {
        background-image: radial-gradient(
          31.3% 31.36% at 50% 50%,
          rgba(255, 255, 255, 0.5) 0%,
          rgba(255, 255, 255, 0.15) 48.44%,
          rgba(255, 255, 255, 0) 100%
        );
        transform: translate(-50%, -50%) rotate(-90deg);
      }
    }

    &.purple {
      top: ${37 * 2}px;
      right: 0;

      &::before {
        height: 18px;
        background-image: radial-gradient(
          31.3% 31.36% at 50% 50%,
          rgba(168, 115, 255, 0.24) 0%,
          rgba(168, 115, 255, 0.275) 48.44%,
          rgba(133, 73, 255, 0) 100%
        );
      }

      &::after {
        background-image: radial-gradient(
          31.3% 31.36% at 50% 50%,
          rgba(168, 115, 255, 0.14) 0%,
          rgba(168, 115, 255, 0.275) 48.44%,
          rgba(133, 73, 255, 0) 100%
        );
        transform: translate(-50%, -50%) rotate(-90deg);
      }
    }
  }

  ${media(
    'minTablet',
    css`
      margin-top: 0;

      .title {
        ${textStyle('display', 4)}
        margin:  0 auto;
        text-align: center;
      }

      .effect {
        &.large {
          &::before {
            height: 18px;
          }

          &::after {
            height: 18px;
          }
        }

        &.small {
          &::before {
            height: 14px;
          }

          &::after {
            height: 14px;
          }
        }

        &.lightGray {
          left: 0;
          transform: translate(5%, -10%) scaleY(0.65);
        }

        &.lightBlue {
          top: -20px;
          left: auto;
          right: 40%;
          transform: translate(50%, 0);
        }

        &.purple {
          top: ${51 * 2}px;
          right: -20%;
          transform: translate(-25%, -50%) scaleX(1.25);
        }
      }
    `
  )}

  ${media(
    'minLaptop',
    css`
      .title {
        ${textStyle('display', 3)}
        text-align: left;
      }

      .effect {
        &.lightGray {
          top: ${76 * 2}px;
          left: -2.5%;
          transform: translate(-50%, -50%) scaleY(0.75);

          &::before,
          &::after {
            width: 80%;
            height: 50%;
          }

          &::before {
            width: 400px;
          }
        }

        &.lightBlue {
          top: ${76 * 1}px;
          left: 35%;
          right: auto;
          transform: translate(-50%, -50%) scaleX(1.5);

          &::before {
            height: 15px;
          }

          &::after {
            width: 200px;
            height: 10px;
          }
        }

        &.purple {
          top: ${76 * 3}px;
          right: -40%;
          width: 110%;
          transform: translate(0, -50%) scaleX(1);

          &::before,
          &::after {
            height: 10px;
          }

          &::after {
            width: 200px;
            height: 18px;
          }
        }
      }
    `
  )}

  ${media(
    'minDesktop',
    css`
      &.large {
        &::before {
          width: 720px;
          height: 18px;
        }

        &::after {
          width: 120px;
          height: 18px;
          transform: translate(-50%, -50%) rotate(-90deg);
        }
      }

      &.small {
        &::before {
          width: 395px;
          height: 14px;
        }

        &::after {
          width: 66px;
          height: 14px;
          transform: translate(-50%, -50%) rotate(-90deg);
        }
      }
    `
  )}

  @keyframes blink {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }
`

export const StyledStakeConnect = styled.div`
  width: 100%;

  .connectButton {
    ${mdButtonStyle}
    width: 100%;
  }

  ${media(
    'minTablet',
    css`
      margin-right: auto;
      margin-left: auto;

      .connectButton {
        ${lgButtonStyle}
        margin-top: 0;
      }
    `
  )}

  ${media(
    'minLaptop',
    css`
      max-width: 560px;
      margin-left: 0;
    `
  )}

${media(
    'minDesktop',
    css`
      max-width: 580px;
    `
  )}
`

export const StyledStakeJoinButton = styled(motion.div)`
  width: 100%;
  margin-top: 4px;

  &.hasBalance {
    .joinButton {
      margin-top: 8px;
    }
  }

  .joinButton {
    ${buttonStyle}
    ${textStyle('button', 3)}
    width: 100%;
    height: 48px;
    color: var(--white);
  }

  ${media(
    'minTablet',
    css`
      margin: 16px auto 0;

      &.hasBalance {
        .joinButton {
          margin-top: 0;
        }
      }

      .joinButton {
        ${textStyle('button', 2)}
        margin: 0 auto;
        height: 56px;

        &:hover {
          ${onArrowHover()}
        }
      }
    `
  )}

  ${media(
    'minLaptop',
    css`
      margin-left: 0;

      .joinButton {
        ${textStyle('button', 2)}
        max-width: unset
      }
    `
  )}

  ${media(
    'minDesktop',
    css`
      max-width: 580px;
    `
  )}
`

export const StyledStakeJoinTooltip = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  .tooltip {
    pointer-events: initial;
  }

  @keyframes floatBottom {
    0% {
      transform: translate3d(-50%, 0, 0);
    }

    100% {
      transform: translate3d(-50%, -4px, 0);
    }
  }
`
