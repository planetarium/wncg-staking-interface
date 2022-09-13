import { memo } from 'react'
import { motion } from 'framer-motion'
import styles from '../styles/Block.module.scss'

import { formTransition, blockVariants } from '../constants'

function StakeFormBlock() {
  return (
    <motion.section
      className={styles.block}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={formTransition}
      variants={blockVariants}
    >
      <h1>
        Staking is halted due to the migration.
        <br />
        You can still unstake if you have any in the old contract.
      </h1>
    </motion.section>
  )
}

const MemoizedStakeFormBlock = memo(StakeFormBlock)
export { MemoizedStakeFormBlock as StakeFormBlock }
