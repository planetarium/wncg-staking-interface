import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import Image from 'next/image'
import { motion } from 'framer-motion'
import styles from './styles/MigrationNotice.module.scss'

import { isMobileAtom } from 'states/ui'
import {
  migrationGuideTransitionDesktop,
  migrationGuideTransitionMobile,
  migrationGuideVariants,
} from './constants'

import { Icon } from 'components/Icon'

type MigrationNoticeProps = {
  open(): void
}

export function MigrationNotice({ open }: MigrationNoticeProps) {
  const isMobile = useAtomValue(isMobileAtom)

  const transition = useMemo(
    () =>
      isMobile
        ? migrationGuideTransitionMobile
        : migrationGuideTransitionDesktop,
    [isMobile]
  )

  return (
    <motion.aside
      className={styles.migrationNotice}
      key="migrationNotice"
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
      variants={migrationGuideVariants}
      onClick={open}
      role="button"
    >
      <div className={styles.content}>
        <h1 className={styles.title}>
          Please migrate to the new WNCG Staking contract!
          <Icon id="chevronRight" ariaHidden />
        </h1>
        <p className={styles.desc}>
          Current contract will no longer distribute the rewards from early
          October.
        </p>
      </div>

      <div className={styles.figure} aria-hidden>
        <Image
          src="/img-migration.png"
          layout="fill"
          objectFit="contain"
          priority
          alt=""
        />
      </div>
    </motion.aside>
  )
}
