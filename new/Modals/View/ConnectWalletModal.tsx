import type { MouseEvent } from 'react'
import { useConnect } from 'wagmi'
import clsx from 'clsx'

import { ModalCategory } from 'states/ui'
import { gaEvent } from 'lib/gtag'
import { assertUnreachable } from 'utils/assertion'
import { useModal } from 'hooks'

import { StyledConnectWalletModal } from './styled'
import ModalClose from '../shared/ModalClose'
import SvgIcon, { SvgIconType } from 'new/SvgIcon'

function ConnectWalletModal() {
  const { removeModal } = useModal()

  const { connect: initConnect, connectors } = useConnect({
    onSuccess() {
      removeModal(ModalCategory.Connect)
    },
  })

  function connect(e: MouseEvent<HTMLButtonElement>) {
    const index = Number(e.currentTarget.value)
    const connector = connectors[index]

    initConnect({ connector })
    gaEvent({
      name: 'connect_metamask',
      params: {
        walletProvider: connector.name,
      },
    })
  }

  return (
    <StyledConnectWalletModal>
      <header className="header">
        <div className="titleGroup">
          <h2 className="title">Connect a wallet</h2>
        </div>
        <p className="desc">
          By connecting a wallet, you agree to Nine Chronicles Ltd&apos;s Terms
          of Service and Privacy Policy.
        </p>
        <ModalClose modal={ModalCategory.Connect} />
      </header>

      <div className="buttonGroup">
        {connectors.map((connector, i) => {
          return (
            <button
              className={clsx('connectButton', connector.id)}
              key={`connect:${connector.id}`}
              type="button"
              onClick={connect}
              value={i}
              disabled={!connector.ready}
            >
              <SvgIcon icon={connector.id as SvgIconType} $size={64} />
              {renderButtonLabel(connector.name)}
            </button>
          )
        })}
      </div>
    </StyledConnectWalletModal>
  )
}

export default ConnectWalletModal

function renderButtonLabel(name?: string) {
  switch (name) {
    case 'MetaMask':
      return 'Metamask'
    case 'Coinbase Wallet':
      return 'Coinbase'
    case 'WalletConnect':
      return 'WalletConnect'
    default:
      assertUnreachable(name)
  }
}
