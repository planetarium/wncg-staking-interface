import { useRouter } from 'next/router'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './styles/Alert.module.scss'

import { getShowNetworkAlert } from 'app/states/connection'
import { IS_ETHEREUM } from 'utils/env'
import { useAppSelector, useConnection } from 'hooks'

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
  const { switchToMainnet } = useConnection()
  const { pathname } = useRouter()
  const showNetworkAlert = useAppSelector(getShowNetworkAlert)

  const isStakingPage =
    pathname === '/wncg' || pathname.startsWith('/wncg/pool')
  const showAlert = isStakingPage && showNetworkAlert

  return (
    <AnimatePresence>
      {showAlert && (
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
          <h1>
            Please switch to{' '}
            {IS_ETHEREUM ? 'Ethereum Mainnet' : 'Kovan Testnet'}
          </h1>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
