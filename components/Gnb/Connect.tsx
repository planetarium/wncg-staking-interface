import { useRecoilValue } from 'recoil'
import { useAccount } from 'wagmi'
import styles from './style.module.scss'

import { isMobileState } from 'app/states/mediaQuery'
import { useConnectWallets } from 'hooks'

import { Button } from 'components/Button'

export function GnbConnect() {
  const { isConnecting, isDisconnected } = useAccount()
  const { connect } = useConnectWallets()

  const isMobile = useRecoilValue(isMobileState)

  const buttonSize = isMobile ? 'small' : 'medium'

  if (isDisconnected) {
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

  if (isConnecting) {
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
