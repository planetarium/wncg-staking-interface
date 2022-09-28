import { atom } from 'recoil'
import type { Network } from '@balancer-labs/sdk'

export const ConnectionStatus = {
  NotConnected: 'CONNECTION_STATUS_NOT_CONNECTED',
  Connecting: 'CONNECTION_STATUS_CONNECTING',
  Connected: 'CONNECTION_STATUS_CONNECTED',
} as const
export type ConnectionStatus =
  typeof ConnectionStatus[keyof typeof ConnectionStatus]

export const currentNetworkIdState = atom<null | Network>({
  key: '#currentNetworkId',
  default: null,
})

export const connectionStatusState = atom<ConnectionStatus>({
  key: '#connectionStatus',
  default: ConnectionStatus.NotConnected,
})
