import styled from 'styled-components'
import { motion } from 'framer-motion'

import { ModalPage } from 'components/Modals/shared'
import { backdropFilter, flexbox, textGradient, textStyle } from 'styles/utils'
import { buttonStyle } from 'components/Button/styled'
import { GUTTER_TABLET } from 'styles/constants/dimensions'

export const StyledPoolMobileContainer = styled(motion.aside)`
  ${flexbox()}
  ${backdropFilter(80, 'rgba(var(--black-rgb), 0.6)', 'var(--black)')}
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 100;
`

export const StyledPoolMobile = styled(ModalPage)`
  max-width: unset;

  .modalHeader,
  .container,
  .modalFooter {
    max-width: ${800 - GUTTER_TABLET * 2}px;
    margin: 0 auto;
  }

  .container {
    margin-right: auto;
    margin-left: auto;
  }

  .poolInfo {
    ${flexbox('end')}
    ${textStyle('body', 3)}
    width: 100%;
    margin-top: 24px;

    h5 {
      ${textStyle('body', 3, 700)}
      color: rgba(var(--white-rgb), 0.9);
    }

    .linkButton {
      ${flexbox('end')}
      margin-left: 8px;
      font-weight: 500;
      color: rgba(var(--white-rgb), 0.6);
    }
  }
`

export const StyledPoolMobileHeader = styled.header`
  .poolName {
    ${textStyle('body', 3, 700)}
    ${textGradient(4)}
  }

  .titleGroup {
    margin-top: 12px;
  }
`

export const StyledPoolMobileForm = styled.form`
  .formHeader {
    position: relative;
    width: 100%;

    .title {
      ${flexbox('center', 'start')}
      ${textStyle('title', 1)}
      flex-direction: column;

      .tokenIconGroup {
        margin-bottom: 8px;

        .tokenIcon {
          margin-left: -8px;
        }
      }
    }

    .buttonGroup {
      ${flexbox('end')}
      position: absolute;
      top: 32px;
      right: 0;

      button {
        flex-shrink: 0;
      }
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
        width: 100%;
        bottom: calc(100% + 4px);
        white-space: initial;
      }

      .slippageToggle {
        height: 20px;
      }
    }

    .resetButton {
      ${buttonStyle}
      width: 32px;
      height: 32px;
      margin-left: 12px;
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
  ${flexbox()}
  flex-direction: column;
  width: 100%;
  height: 100vh;

  .title {
    ${textStyle('body', 2, 700)}
  }

  button {
    width: 200px;
    margin-top: 32px;
  }
`
