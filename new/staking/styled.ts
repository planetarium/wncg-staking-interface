import styled from 'styled-components'

import { flexbox, posCenter, textStyle } from 'newStyles/utils'

export const StyledStakingDashboard = styled.section`
  width: 660px;
  text-align: center;

  .detail {
    ${flexbox()}
  }

  .detailItem {
    margin-right: 56px;

    &:last-child {
      margin-right: 0;
    }

    dt {
      ${textStyle('body', 3)}
      margin-bottom: 8px;
      color: rgba(var(--white-rgb), 0.6);
    }

    dd {
      * {
        ${textStyle('number')}
      }
    }
  }
`

export const StyledStakingHeader = styled.header`
  position: relative;
  width: 660px;

  .title {
    ${textStyle('display', 3)}
    margin-bottom: 80px;
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

    &.linear {
      top: 53px;
      right: 89px;
      width: 730px;
      height: 24px;
      animation-delay: 300ms;

      &::before {
        width: 730px;
        height: 24px;
        background-image: radial-gradient(
          31.3% 31.36% at 50% 50%,
          rgba(235, 176, 119, 0.5) 0%,
          rgba(235, 176, 119, 0.18) 54.78%,
          rgba(235, 176, 119, 0) 100%
        );
        opacity: 0.8;
      }
    }

    &.diamondLight {
      top: 110px;
      right: 330px;
      width: 395px;
      height: 66px;
      animation-delay: 700ms;

      &::before {
        width: 395px;
        height: 14px;
        background-image: radial-gradient(
          31.3% 31.36% at 50% 50%,
          rgba(235, 176, 119, 0.5) 0%,
          rgba(235, 176, 119, 0.18) 54.78%,
          rgba(235, 176, 119, 0) 100%
        );
      }

      &::after {
        width: 66px;
        height: 18px;
        background-image: radial-gradient(
          31.3% 31.36% at 50% 50%,
          rgba(234, 118, 111, 0.5) 0%,
          rgba(234, 118, 111, 0.15) 48.44%,
          rgba(234, 118, 111, 0) 100%
        );
        transform: translate(-50%, -50%) rotate(-90deg);
      }
    }

    &.diamondDark {
      top: 176px;
      left: 292px;
      width: 552px;
      height: 80px;

      &::before {
        width: 552px;
        height: 18px;
        background-image: radial-gradient(
          31.3% 31.36% at 50% 50%,
          rgba(234, 118, 111, 0.5) 0%,
          rgba(234, 118, 111, 0.15) 48.44%,
          rgba(234, 118, 111, 0) 100%
        );
      }

      &::after {
        width: 80px;
        height: 18px;
        background-image: radial-gradient(
          31.3% 31.36% at 50% 50%,
          rgba(234, 118, 111, 0.5) 0%,
          rgba(234, 118, 111, 0.15) 48.44%,
          rgba(234, 118, 111, 0) 100%
        );
        transform: translate(-50%, -50%) rotate(-90deg);
      }
    }
  }

  @keyframes blink {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }
`

export const StyledStakingForm = styled.form`
  width: 560px;

  .actionButton {
    margin-top: 32px;
  }

  footer {
    ${flexbox()}
    width: 100%;
    margin-top: 32px;
  }
`
