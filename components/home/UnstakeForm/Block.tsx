import { memo } from 'react'
import { useRecoilValue } from 'recoil'
import { motion } from 'framer-motion'
import styles from '../styles/Block.module.scss'

import { legacyModeState } from 'app/states/settings'
import { UnstakeStatus, useUnstakeTimestamps } from 'hooks/useUnstakeTimestamps'
import { formTransition, blockVariants } from '../constants'

import { UnstakeFormTimer } from './Timer'

function UnstakeFormBlock() {
  const { unstakeStatus } = useUnstakeTimestamps()
  const isCoolingDown = unstakeStatus === UnstakeStatus.CooldownInProgress
  const legacyMode = useRecoilValue(legacyModeState)

  return (
    <motion.section
      className={styles.block}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={formTransition}
      variants={blockVariants}
    >
      {isCoolingDown ? (
        <UnstakeFormTimer />
      ) : (
        renderBlockMessage(unstakeStatus, legacyMode)
      )}
    </motion.section>
  )
}

function renderBlockMessage(status: UnstakeStatus, legacyMode: boolean) {
  if (legacyMode) {
    if (status === UnstakeStatus.NoStake) {
      return <h1>Nothing to cooldown & withdraw</h1>
    }

    return (
      <h1>
        Start cooldown to withdraw your stake.
        <br />
        It will only take 1 minute to start unstaking.
        <span className={styles.misc}>( instead of ordinary 14 days )</span>
      </h1>
    )
  }

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
