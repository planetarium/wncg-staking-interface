import { createGlobalStyle, css } from 'styled-components'

import {
  GNB_HEIGHT_DESKTOP,
  GNB_HEIGHT_MOBILE,
  GNB_HEIGHT_TABLET,
} from './constants/dimensions'
import { gradient, media } from './utils'

const TOAST_PADDING = 8
const TOAST_BODY_PADDING = 16

const ToastStyle = createGlobalStyle`
  .toastContainer {
    top: ${GNB_HEIGHT_MOBILE}px;
    right: ${16 - TOAST_PADDING}px;
    width: 320px;
    padding: 0;
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

  .fadeIn,
  .fadeOut {
    animation-name: fadeIn;
    animation-duration: 200ms;
    animation-timing-function: ease-in;
  }

  .fadeOut {
    animation-direction: reverse;
    animation-fill-mode: forwards;
  }

  ${media(
    'minTablet',
    css`
      .toastContainer {
        top: ${GNB_HEIGHT_TABLET - 8}px;
      }

      .toast {
        padding: ${TOAST_PADDING}px ${TOAST_PADDING}px 0 0;
      }

      .progressBar {
        max-width: calc(100% - ${TOAST_PADDING}px) !important;
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

  @keyframes fadeIn {
    0% {
      transform: translate3d(120%, 0, 0);
    }

    100% {
      transform: translate3d(0, 0, 0);
    }
  }
`

export default ToastStyle
