import styled, { css } from 'styled-components'

import { flexbox, media, posCenterY, textStyle } from 'styles/utils'

import { ModalPage } from 'components/Modals/shared'

export const StyledConnectModal = styled(ModalPage)`
  .modalHeader {
    padding-bottom: 8px;
  }

  .buttonGroup {
    ${flexbox()}
    flex-direction: column;
    width: 100%;
  }

  .connectButton {
    ${flexbox()}
    position: relative;
    width: 100%;
    flex-grow: 1;
    padding: 12px 16px;
    margin-top: 16px;
    font-weight: 700;
    border-radius: 8px;
    color: var(--white);

    &:first-child {
      margin-top: 0;
    }

    &.metaMask {
      background-image: linear-gradient(
        131.45deg,
        #ffac5f 1.52%,
        #d96f26 98.73%
      );
    }

    &.coinbaseWallet {
      background-image: linear-gradient(
        131.3deg,
        #c1d3ff 1.47%,
        #5379db 99.24%
      );
    }

    &.walletConnect {
      background-image: linear-gradient(
        132.67deg,
        #006dff 1.77%,
        #0038ff 99.91%
      );
    }

    &.trustWallet {
      background-image: linear-gradient(270deg, #3375bb 0%, #0c3b6c 100%);
    }

    &.bsc {
      background-color: var(--gray-900);
    }

    .icon {
      ${posCenterY()}
      left: 16px;
    }

    .label {
      ${textStyle('body', 2)}
      flex-grow: 1;
      text-align: center;
      font-weight: 700;
    }
  }

  .desc {
    a {
      text-decoration: underline;
    }
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      .modalContent,
      .modalFooter {
        opacity: 0.5;
      }
    `}

  ${media(
    'minLaptop',
    css`
      max-width: 480px;

      .modalHeader {
        padding-bottom: 0;
      }
    `
  )}
`

export const StyledRevenueModal = styled(ModalPage)`
  .modalHeader {
    ${flexbox('between')}

    .subtitle {
      ${flexbox('start')}

      .icon {
        margin-right: 8px;
      }
    }
  }

  .container {
    margin-top: 10px !important;
  }

  .modalContent {
    padding-top: 0;
  }

  .desc {
    padding: 12px;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.4285714285714286;
    color: rgba(var(--white-rgb), 0.6);
    background-color: var(--gray-700);
    border-radius: 8px;
  }

  .revenueList {
    margin-top: 16px;
  }
`

export const StyledSwitchNetworkModal = styled(ModalPage)`
  max-width: 480px;
  padding: 48px;

  .header {
    ${flexbox()}
    flex-direction: column;
    margin-bottom: 48px;
  }

  .title {
    ${textStyle('header', 6)}
    margin-bottom: 0;
    color: var(--white);
    text-align: center;
  }

  .buttonGroup {
    &:first-child {
      margin-top: 0;
    }

    button {
      margin-top: 16px;
    }
  }
`
