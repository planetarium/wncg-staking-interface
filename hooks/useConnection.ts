import { providers } from 'ethers'
import type { ExternalProvider } from '@ethersproject/providers'

import { resetBpt } from 'app/states/bpt'
import {
  getAccount,
  resetConnection,
  setAccount,
  setChainId,
  setConnecting,
} from 'app/states/connection'
import { ModalCategory } from 'app/states/modal'
import { resetRewards } from 'app/states/reward'
import { resetStakedBalance } from 'app/states/stake'
import { resetTimestamps } from 'app/states/unstake'
import { gaEvent } from 'lib/gtag'
import { IS_ETHEREUM } from 'utils/env'
import { useError } from './useError'
import { useModal } from './useModal'
import { useAppDispatch, useAppSelector } from './useRedux'

export function useConnection() {
  const { handleError } = useError()
  const { addModal, removeModal } = useModal()

  const dispatch = useAppDispatch()
  const account = useAppSelector(getAccount)

  async function sendConnectionRequest() {
    dispatch(setConnecting())

    const provider = new providers.Web3Provider(
      window.ethereum as any as ExternalProvider,
      'any'
    )

    try {
      const accounts = await provider.send('eth_requestAccounts', [])
      if (accounts && accounts[0]) {
        updateAccount(accounts[0])
        gaEvent({
          name: 'connect_metamask',
          params: {
            account: accounts[0],
          },
        })
      }
      removeModal(ModalCategory.Connect)
    } catch (error) {
      dispatch(resetConnection())
      handleError(error)
    }
  }

  function disconnect() {
    dispatch(resetConnection())
    dispatch(resetBpt())
    dispatch(resetRewards())
    dispatch(resetStakedBalance())
    dispatch(resetTimestamps())
    gaEvent({
      name: 'disconnect_metamask',
      params: {
        account,
      },
    })
  }

  function switchToMainnet() {
    if (typeof window === 'undefined' || !window.ethereum) {
      return
    }

    gaEvent({
      name: 'switch_network',
      params: {
        oldNetwork: window?.ethereum?.chainId,
      },
    })

    window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: IS_ETHEREUM ? '0x1' : '0x2a' }],
    })
  }

  function connect() {
    if (typeof window === 'undefined' || !window.ethereum) {
      addModal({
        category: ModalCategory.MetaMaskGuide,
      })
      return
    }

    sendConnectionRequest()
  }

  function updateAccount(account: string) {
    dispatch(setAccount(account))
  }

  function updateChainId(chainId: number) {
    dispatch(setChainId(chainId))
  }

  return {
    connect,
    disconnect,
    switchToMainnet,
    updateAccount,
    updateChainId,
  }
}
