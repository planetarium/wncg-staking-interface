import { useEffect, useState } from 'react'
import { useAccount as useWagmiAccount } from 'wagmi'
import type { Connector } from 'wagmi'

export function useAccount() {
  const [account, setAccount] = useState<string | undefined>()
  const [connector, setConnector] = useState<Connector | undefined>()
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDisconnected, setIsDisconnected] = useState(false)

  const {
    address,
    connector: _connector,
    isConnected: _isConnected,
    isConnecting: _isConnecting,
    isDisconnected: _isDisconnected,
  } = useWagmiAccount()

  function updateAccountStatus() {
    setAccount(address)
    setConnector(_connector)
    setIsConnected(_isConnected)
    setIsConnecting(_isConnecting)
    setIsDisconnected(_isDisconnected)
  }

  useEffect(updateAccountStatus, [
    _connector,
    _isConnected,
    _isConnecting,
    _isDisconnected,
    address,
    connector,
  ])

  return {
    account,
    connector,
    isConnected,
    isConnecting,
    isDisconnected,
  }
}
