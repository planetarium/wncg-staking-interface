/* eslint-disable react/jsx-no-target-blank */
import { useRecoilValue } from 'recoil'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './styles/MigrationModal.module.scss'

import { isMobileState } from 'app/states/mediaQuery'
import {
  modalDesktopVariants,
  modalMobileVariants,
  overlayVariants,
} from 'components/Modal/constants'

import { Button } from 'components/Button'
import { Icon } from 'components/Icon'

type MigrationModalProps = {
  close(): void
  showModal: boolean
}

export function MigrationModal({ close, showModal }: MigrationModalProps) {
  const isMobile = useRecoilValue(isMobileState)
  const variants = isMobile ? modalMobileVariants : modalDesktopVariants

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className={styles.overlay}
          variants={overlayVariants}
          key="blurModalOverlay"
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4 }}
        >
          <motion.aside
            className={styles.migrationModal}
            key="MigrationModal"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <header className={styles.header}>
              <h1 className={styles.title}>
                Press the button below <br />
                and follow the guide.
              </h1>

              <button
                className={styles.closeButton}
                type="button"
                onClick={close}
                aria-label="Close"
              >
                <Icon id="close" />
              </button>
            </header>

            <p className={styles.desc}>
              <a
                href="https://forum.balancer.fi/t/bip-57-introduce-gauge-framework-v1/3604"
                target="_blank"
                rel="noopener"
              >
                As of the Balancer gauge update,
              </a>{' '}
              you need to unstake your assets from the old contract and stake to
              the new contract to get rewards. You can go to the new contract
              page by using toggle button on the upper-right side.
            </p>

            <footer className={styles.footer}>
              <Button
                href="https://planetarium.notion.site/WNCG-Staking-Migration-Step-by-step-guide-draft-98ea0e277e9d49d0a5ac573459bd3124"
                size="large"
                target="_blank"
                fullWidth
              >
                See step-by-step guide
              </Button>
            </footer>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
