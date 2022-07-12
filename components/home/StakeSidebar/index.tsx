import { memo } from 'react'
import { motion } from 'framer-motion'
import styles from '../styles/StakeSidebar.module.scss'

import { gaEvent } from 'lib/gtag'
import { BALANCER_POOL_URL } from 'utils/env'
import { motionVariants, sidebarTransition } from '../constants'

import { Button } from 'components/Button'
import { StakeSidebarAdvanced } from './Advanced'
import { StakeSidebarBalance } from './Balance'

function StakeSidebar() {
  function handleOpenBalancer() {
    gaEvent({
      name: 'open_balancer_pool',
    })
  }

  return (
    <motion.aside
      initial="initial"
      animate="animate"
      exit="exit"
      transition={sidebarTransition}
      variants={motionVariants}
    >
      <h1 className={styles.title}>Earn WNCG & BAL by staking 20WETH-80WNCG</h1>
      <p className={styles.desc}>
        Provide liquidity to the 20WETH-80WNCG Balancer pool{' '}
        <strong>without staking in Balancer</strong>, and then stake your
        20WETH-80WNCG pool token here to earn WNCG and additional BAL reward.
      </p>

      <StakeSidebarBalance />

      <Button
        href={BALANCER_POOL_URL}
        onClick={handleOpenBalancer}
        target="_blank"
        fullWidth
      >
        Get 20WETH-80WNCG
      </Button>

      <StakeSidebarAdvanced />
    </motion.aside>
  )
}

const MemoizedStakeSidebar = memo(StakeSidebar)
export { MemoizedStakeSidebar as StakeSidebar }
