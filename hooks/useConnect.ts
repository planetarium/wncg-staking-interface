import { useCallback } from 'react'
import { useConnect as _useConnect } from 'wagmi'

import config from 'config'
import { ModalType } from 'config/constants'
import { createWallets } from 'lib/wagmi/wallets'
import { useModal } from './useModal'

export function useConnect() {
  const { addModal, removeModal } = useModal()

  const { connectAsync, connectors } = _useConnect({
    chainId: config.chainId,
    onSuccess: removeModal,
  })

  const wallets = createWallets({
    chainId: config.chainId,
    connect: connectAsync,
  })

  const connect = useCallback(
    async (connectorId: ConnectorId) => {
      const connector = connectors.find((c) => c.id === connectorId)

      const walletConfig = wallets.find((w) => w.connectorId === connectorId)

      if (walletConfig?.installed === false) {
        if (walletConfig.downloadLink) {
          window.open(walletConfig.downloadLink)
        }
        removeModal()
        return
      }

      try {
        await connectAsync({
          connector,
          chainId: config.chainId,
        })
      } catch (error: any) {
        if (
          error?.code === 4001 ||
          error?.code === 'ACTION_REJECTED' ||
          error.error === 'Rejected by user' ||
          Object.keys(error).length === 0 // NOTE: WalletConnect UserRejection
        )
          return
        if (
          error?.code === -32002 ||
          error.name === 'ConnectorAlreadyConnectedError'
        ) {
          removeModal()
          return
        }
        throw error
      }
    },
    [connectAsync, connectors, removeModal, wallets]
  )

  const openConnectModal = useCallback(() => {
    addModal({
      type: ModalType.Connect,
    })
  }, [addModal])

  return {
    connect,
    connectors,
    openConnectModal,
    wallets,
  }
}
