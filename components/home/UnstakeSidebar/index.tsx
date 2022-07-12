import { memo } from 'react'
import { motion } from 'framer-motion'

import { motionVariants, sidebarTransition } from '../constants'

import { UnstakeSidebarCooldown } from './Cooldown'
import { UnstakeSidebarWithdrawWindow } from './WithdrawWindow'

type UnstakeSidebarProps = {
  isWithdrawable: boolean
}

function UnstakeSidebar({ isWithdrawable }: UnstakeSidebarProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      transition={sidebarTransition}
      variants={motionVariants}
    >
      {isWithdrawable ? (
        <UnstakeSidebarWithdrawWindow />
      ) : (
        <UnstakeSidebarCooldown />
      )}
    </motion.div>
  )
}

const MemoizedUnstakeSidebar = memo(UnstakeSidebar)
export { MemoizedUnstakeSidebar as UnstakeSidebar }
