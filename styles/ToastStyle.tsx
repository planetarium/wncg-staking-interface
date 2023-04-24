import { createGlobalStyle, css } from 'styled-components'

import {
  GNB_HEIGHT_DESKTOP,
  GNB_HEIGHT_TABLET,
  GUTTER_MOBILE,
  GUTTER_TABLET,
} from './constants/dimensions'
import { gradient, media } from './utils'

const TOAST_PADDING = 8
const TOAST_BODY_PADDING = 16

const ToastStyle = createGlobalStyle`
  .toastContainer {
    top: 16px;
    left: 50%;
    width: calc(100% - ${GUTTER_MOBILE * 2}px);
    padding: 0;
    transform: translateX(-50%);
  }

  .toast {
    padding: 0;
    margin-top: 16px;
    border-radius: 8px;
    background-color: transparent;

    &:first-child {
      margin-top: 0;
    }
  }

  .toastBody {
    display: block;
    width: 100%;
    padding: ${TOAST_BODY_PADDING}px;
    border-radius: 8px; 
    background-color: var(--white);

    &:has(+ .progressBar.Toastify__progress-bar--animated) {
      &::before {
        opacity: 1;
      }
    }

    &::before {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background-color: var(--gray-300);
      content: '';
      opacity: 0;
      transition: 200ms;
    }
  }

  .progressBar {
    height: 4px;
    background-image: ${gradient(1)};
  }

  .toastIn,
  .toastOut {
    animation-name: slideFromTop;
    animation-duration: 300ms;
    animation-timing-function: ease-in;
  }

  .toastOut {
    animation-direction: reverse;
    animation-fill-mode: forwards;
  }

  ${media(
    'minTablet',
    css`
      .toastContainer {
        width: calc(100% - ${GUTTER_TABLET * 2}px);
      }

      .toastIn,
      .toastOut {
        animation-name: slideFromRight;
        animation-duration: 200ms;
      }
    `
  )}

  ${media(
    'minLaptop',
    css`
      .toastContainer {
        top: ${GNB_HEIGHT_TABLET}px;
        right: ${16 - TOAST_PADDING}px;
        left: auto;
        width: 320px;
        padding: 0;
        transform: none;
      }

      .toastBody {
        &::before {
          width: calc(100% - 8px);
          border-radius: 0 0 50px 0;
        }
      }

      .toast {
        padding: ${TOAST_PADDING}px ${TOAST_PADDING}px 0 0;
      }

      .progressBar {
        width: calc(100% - ${TOAST_PADDING}px);
      }
    `
  )}

  ${media(
    'minDesktop',
    css`
      .toastContainer {
        top: ${GNB_HEIGHT_DESKTOP - 8}px;
      }
    `
  )}

  @keyframes slideFromRight {
    0% {
      transform: translate3d(120%, 0, 0);
    }

    100% {
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes slideFromTop {
    0% {
      transform: translate3d(0, -120%, 0);
      opacity: 0;
    }

    100% {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }
`

export default ToastStyle
