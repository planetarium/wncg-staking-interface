import { useRecoilValue } from 'recoil'
import styles from './style.module.scss'

import { isMobileState } from 'app/states/mediaQuery'
import { useWeb3 } from 'hooks'

import { Button } from 'components/Button'
import { useAccount } from 'wagmi'

export function GnbConnect() {
  const { isConnecting, isDisconnected } = useAccount()
  const { openConnectModal } = useWeb3()

  const isMobile = useRecoilValue(isMobileState)

  const buttonSize = isMobile ? 'small' : 'medium'

  if (isDisconnected) {
    return (
      <Button
        className={styles.connectButton}
        size={buttonSize}
        onClick={openConnectModal}
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
