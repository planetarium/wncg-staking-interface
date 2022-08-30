import { AnimatePresence, motion } from 'framer-motion'
import { Network } from '@balancer-labs/sdk'
import styles from './styles/Alert.module.scss'

import { assertUnreachable } from 'utils/assertion'
import { networkChainId } from 'utils/network'
import { useAlert, useConnection } from 'hooks'

import { Icon } from './Icon'

const motionVariants = {
  initial: {
    y: '-100%',
  },
  animate: {
    y: 0,
  },
  exit: {
    y: '-100%',
  },
}

// NOTE: styles/constants/_transitions.scss
const motionTransition = { ease: 'easeOut', duration: 0.3 }

export function NetworkAlert() {
  const { showNetworkAlert } = useAlert()
  const { switchToMainnet } = useConnection()

  return (
    <AnimatePresence>
      {showNetworkAlert && (
        <motion.aside
          className={styles.alert}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={motionTransition}
          variants={motionVariants}
          onClick={switchToMainnet}
        >
          <Icon className={styles.icon} id="alert" />
          <h1>Please switch to {getNetworkFullName(networkChainId)}</h1>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

function getNetworkFullName(chainId: Network) {
  switch (chainId) {
    case Network.MAINNET:
      return 'Ethereum Mainnet'
    case Network.GOERLI:
      return 'Goerli Testnet'
    case Network.KOVAN:
      return 'Kovan Testnet'
    default:
      assertUnreachable(chainId)
  }
}
