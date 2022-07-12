import { ConnectionStatus, getStatus } from 'app/states/connection'
import { getIsMobile } from 'app/states/mediaQuery'
import { useAppSelector, useConnection } from 'hooks'

import { Button } from 'components/Button'

export function GnbConnect() {
  const { connect } = useConnection()
  const status = useAppSelector(getStatus)
  const isMobile = useAppSelector(getIsMobile)

  const buttonSize = isMobile ? 'small' : 'medium'

  if (status === ConnectionStatus.NotConnected) {
    return (
      <Button size={buttonSize} onClick={connect}>
        Connect
      </Button>
    )
  }

  if (status === ConnectionStatus.Connecting) {
    return (
      <Button variant="secondary" size={buttonSize} loading>
        Connecting
      </Button>
    )
  }

  return null
}
