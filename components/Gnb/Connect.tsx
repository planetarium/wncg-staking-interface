import { useRecoilValue } from 'recoil'
import styles from './style.module.scss'

import { ConnectionStatus, connectionStatusState } from 'app/states/connection'
import { isMobileState } from 'app/states/mediaQuery'
import { useConnection } from 'hooks'

import { Button } from 'components/Button'

export function GnbConnect() {
  const { connect } = useConnection()

  const status = useRecoilValue(connectionStatusState)
  const isMobile = useRecoilValue(isMobileState)

  const buttonSize = isMobile ? 'small' : 'medium'

  if (status === ConnectionStatus.NotConnected) {
    return (
      <Button
        className={styles.connectButton}
        size={buttonSize}
        onClick={connect}
      >
        Connect
      </Button>
    )
  }

  if (status === ConnectionStatus.Connecting) {
    return (
      <Button
        className={styles.connectButton}
        variant="secondary"
        size={buttonSize}
        loading
      >
        Connecting
      </Button>
    )
  }

  return null
}
