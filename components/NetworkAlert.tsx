import { AnimatePresence, motion } from 'framer-motion'
import styles from './styles/Alert.module.scss'

import { networkChainId, networkNameFor } from 'utils/network'
import { useAlert, useSwitchNetwork } from 'hooks'

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
  const { switchNetwork } = useSwitchNetwork()

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
          onClick={switchNetwork}
        >
          <Icon className={styles.icon} id="alert" />
          <h1>Please switch to {networkNameFor(networkChainId)}</h1>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
