import type { MouseEvent } from 'react'
import { useAccount, useConnect } from 'wagmi'

import { ModalCategory } from 'app/states/modal'
import { gaEvent } from 'lib/gtag'
import { useModal } from 'hooks'

function ConnectModal() {
  const { isConnected, address } = useAccount()
  const { removeModal } = useModal()

  const { connect, connectors } = useConnect({
    onSuccess() {
      removeModal(ModalCategory.Connect)
    },
  })

  function handleConnect(e: MouseEvent<HTMLButtonElement>) {
    const index = Number(e.currentTarget.value)
    const connector = connectors[index]

    connect({ connector })
    gaEvent({
      name: 'connect_metamask',
      params: {
        walletProvider: connector.name,
      },
    })
  }

  return (
    <aside>
      <header>
        <h2>Connect a wallet</h2>
        <p>
          By connecting a wallet, you agree to Nine Chronicles Ltd&apos;s Terms
          of Service and Privacy Policy.
        </p>
      </header>
      <div>
        {JSON.stringify(isConnected)}
        <hr />
        {JSON.stringify(address)}
      </div>

      <div className="buttonGroup">
        {connectors.map((connector, i) => {
          return (
            <button
              key={`connect_${connector.id}`}
              type="button"
              onClick={handleConnect}
              value={i}
              disabled={!connector.ready}
              style={{ background: 'yellow', padding: 8, marginRight: 8 }}
            >
              {connector.name}
            </button>
          )
        })}
      </div>
    </aside>
  )
}

export default ConnectModal
