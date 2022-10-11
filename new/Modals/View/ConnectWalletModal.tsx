import type { MouseEvent } from 'react'
import { useConnect } from 'wagmi'

import { ModalCategory } from 'states/ui'
import { gaEvent } from 'lib/gtag'
import { useModal } from 'hooks'
import { StyledModalContent } from './styled'

import ModalClose from './ModalClose'

const colors = ['orange', 'skyblue', 'blue']

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
    <StyledModalContent>
      <ModalClose modal={ModalCategory.Connect} />

      <header>
        <h2>Connect a wallet</h2>
        <p>
          By connecting a wallet, you agree to Nine Chronicles Ltd&apos;s Terms
          of Service and Privacy Policy.
        </p>
      </header>

      <div className="buttonGroup">
        {connectors.map((connector, i) => {
          return (
            <button
              key={`connect_${connector.id}`}
              type="button"
              onClick={connect}
              value={i}
              disabled={!connector.ready}
              style={{ background: colors[i], padding: 8, marginRight: 8 }}
            >
              {connector.name}
            </button>
          )
        })}
      </div>
    </StyledModalContent>
  )
}

export default ConnectWalletModal
