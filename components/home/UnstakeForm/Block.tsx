import { memo } from 'react'
import { motion } from 'framer-motion'
import styles from '../styles/UnstakeForm.module.scss'

import { formTransition, blockVariants } from '../constants'

import { UnstakeFormTimer } from './Timer'
import { UnstakeStatus, useUnstakeTimestamps } from 'hooks/useUnstakeTimestamps'

function UnstakeFormBlock() {
  const { unstakeStatus } = useUnstakeTimestamps()
  const isCoolingDown = unstakeStatus === UnstakeStatus.CooldownInProgress

  return (
    <motion.section
      className={styles.block}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={formTransition}
      variants={blockVariants}
    >
      {isCoolingDown ? <UnstakeFormTimer /> : renderBlockMessage(unstakeStatus)}
    </motion.section>
  )
}

function renderBlockMessage(status: UnstakeStatus) {
  switch (status) {
    case UnstakeStatus.NoCooldown:
      return <h1>Start cooldown to withdraw your stake</h1>
    case UnstakeStatus.NoStake:
      return <h1>Nothing to withdraw</h1>
    case UnstakeStatus.NotConnected:
      return <h1>Connect Metamask to withdraw</h1>
    default:
      return null
  }
}

const MemoizedUnstakeFormBlock = memo(UnstakeFormBlock)
export { MemoizedUnstakeFormBlock as UnstakeFormBlock }
