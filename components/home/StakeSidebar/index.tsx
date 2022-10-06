import { memo } from 'react'
import { useAtomValue } from 'jotai'
import { motion } from 'framer-motion'
import styles from '../styles/StakeSidebar.module.scss'

import { rewardTokenSymbolsAtom } from 'states/staking'
import { usePool } from 'hooks'
import { motionVariants, sidebarTransition } from '../constants'

import { Button } from 'components/Button'
import { StakeSidebarAdvanced } from './Advanced'
import { StakeSidebarBalance } from './Balance'

function StakeSidebar() {
  const { poolName, poolTokenName } = usePool()

  const rewardTokenSymbols = useAtomValue(rewardTokenSymbolsAtom)

  return (
    <motion.aside
      initial="initial"
      animate="animate"
      exit="exit"
      transition={sidebarTransition}
      variants={motionVariants}
    >
      <h1 className={styles.title}>
        Earn {rewardTokenSymbols.join(' & ')} by staking {poolTokenName}
      </h1>
      <p className={styles.desc}>
        Provide liquidity to the {poolName} pool{' '}
        <strong>without staking in Balancer</strong>, and then stake your{' '}
        {poolTokenName} pool token here to earn {rewardTokenSymbols[0]} and
        additional {rewardTokenSymbols[1]} reward.
      </p>

      <StakeSidebarBalance />

      <Button href="/wncg/pool" fullWidth>
        Get {poolTokenName || 'BPT'}
      </Button>

      <StakeSidebarAdvanced />
    </motion.aside>
  )
}

const MemoizedStakeSidebar = memo(StakeSidebar)
export { MemoizedStakeSidebar as StakeSidebar }
