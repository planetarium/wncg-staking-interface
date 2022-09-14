import { AnimatePresence, motion } from 'framer-motion'
import styles from './styles/Alert.module.scss'

import { useAlert } from 'hooks'

import { Button } from './Button'
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

export function CoingeckoAlert() {
  const { showCoingeckoAlert } = useAlert()

  function refresh() {
    window?.location.reload()
  }

  return (
    <AnimatePresence>
      {showCoingeckoAlert && (
        <motion.aside
          className={styles.alert}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={motionTransition}
          variants={motionVariants}
          onClick={refresh}
        >
          <Icon className={styles.icon} id="alert" />
          <h1>
            Token price estimation might be incorrect because of connection
            issue with Coingecko.
          </h1>

          <Button variant="secondary" size="small" onClick={refresh}>
            Refresh
          </Button>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
