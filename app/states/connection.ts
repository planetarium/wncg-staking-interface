export const ConnectionStatus = {
  NotConnected: 'CONNECTION_STATUS_NOT_CONNECTED',
  Connecting: 'CONNECTION_STATUS_CONNECTING',
  Connected: 'CONNECTION_STATUS_CONNECTED',
} as const
export type ConnectionStatus =
  typeof ConnectionStatus[keyof typeof ConnectionStatus]
