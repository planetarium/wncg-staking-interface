import styled from 'styled-components'
import { motion } from 'framer-motion'

import { GUTTER_MOBILE } from 'styles/constants/dimensions'
import { backdropFilter, flexbox, textGradient, textStyle } from 'styles/utils'

import { ModalPage } from 'components/Modals/shared'
import { buttonStyle } from 'components/Button/styled'

export const StyledPoolMobileContainer = styled(motion.aside)`
  ${flexbox('end')}
  ${backdropFilter(80, 'rgba(var(--black-rgb), 0.6)', 'var(--black)')}
  position: fixed;
  flex-direction: column;
  bottom: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 48px);
  max-height: -webkit-fill-available;
  z-index: 100;
`

export const StyledPoolMobile = styled(ModalPage)`
  max-width: unset;
  border-radius: 16px 16px 0 0 !important;

  .modalHeader,
  .container,
  .modalFooter {
    max-width: ${800 - GUTTER_MOBILE * 2}px;
    margin: 0 auto;
  }

  .container {
    margin-right: auto;
    margin-left: auto;
  }

  .poolInfo {
    ${flexbox('start')}
    ${textStyle('body', 3)}
    width: 100%;
    margin-top: 24px;

    h5 {
      ${textStyle('body', 3, 700)}
      color: rgba(var(--white-rgb), 0.9);
    }
  }
`

export const StyledPoolMobileHeader = styled.header`
  .titleGroup {
    padding-right: 0 !important;
    margin-top: 12px;
  }

  .title {
    padding-right: 0;
  }

  .poolName {
    ${textStyle('body', 3, 700)}
    ${textGradient(4)}
  }

  .linkButton {
    ${flexbox('start')}
    ${textStyle('body', 4, 700)}
    margin-top: 8px;
    color: rgba(var(--white-rgb), 0.9);

    .icon {
      margin-left: 0;
      color: rgba(var(--white-rgb), 0.6);
    }
  }
`

export const StyledPoolMobileForm = styled.form`
  .formHeader {
    ${flexbox('between')}
    position: relative;
    z-index: 2;
    width: 100%;

    .buttonGroup {
      ${flexbox('end')}
    }

    .slippageControl {
      margin-top: 4px;

      br {
        display: none;
      }

      .tooltipGroup {
        position: static;
      }

      .tooltip {
        width: calc(100vw - ${24 * 2}px);
        white-space: initial;
      }

      .slippageToggle {
        height: 20px;
      }
    }

    .optimizeButton {
      width: 72px;
    }

    .resetButton {
      ${buttonStyle}
      width: 32px;
      height: 32px;
      margin-left: 8px;
      overflow: hidden;
      border-radius: 50%;
      background-color: rgba(var(--white-rgb), 0.05);
      color: var(--white);
      transition: 100ms;

      &:hover:not(:disabled) {
        .icon {
          transform: rotate(360deg);
        }
      }

      &:disabled {
        color: rgba(var(--white-rgb), 0.3);
      }

      .icon {
        transition: 250ms;
      }
    }
  }

  .desc {
    margin-top: 0;
  }
`

export const StyledPoolMobileConnect = styled(motion.div)`
  width: 100%;
  overflow: hidden;

  .title {
    ${textStyle('body', 2, 700)}
  }

  button {
    margin-top: 32px;
  }
`
