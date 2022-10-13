import styled from 'styled-components'

import { flexbox, textStyle } from 'newStyles/utils'
import { StyledModalContent } from '../shared/styled'

export const StyledConnectWalletModal = styled(StyledModalContent)`
  max-width: 720px;

  .header {
    margin-bottom: 40px;
  }

  .title {
    ${textStyle('header', 5)}
    color: var(--white);
  }

  .buttonGroup {
    ${flexbox()};
    width: 100%;
  }

  .connectButton {
    ${flexbox()}
    ${textStyle('body', 1)}
    flex-direction: column;
    flex-grow: 1;
    width: 33%;
    padding: 32px 16px;
    margin-right: 24px;
    font-weight: 700;
    border-radius: 12px;
    color: var(--white);

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

    &:last-child {
      margin-right: 0;
    }

    .icon {
      margin-bottom: 24px;
    }
  }
`

export const StyledSwitchNetworkModal = styled(StyledModalContent)``
