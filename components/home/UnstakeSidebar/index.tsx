import { memo } from 'react'
import { motion } from 'framer-motion'

import { motionVariants, sidebarTransition } from '../constants'

// import { UnstakeSidebarCooldown } from './Cooldown'
// import { UnstakeSidebarWithdrawWindow } from './WithdrawWindow'
import { UnstakeSidebarMigration } from './Migration'

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
      <UnstakeSidebarMigration isWithdrawable={isWithdrawable} />
      {/* {isWithdrawable ? (
        <UnstakeSidebarWithdrawWindow />
      ) : (
        <UnstakeSidebarCooldown />
      )} */}
    </motion.div>
  )
}

const MemoizedUnstakeSidebar = memo(UnstakeSidebar)
export { MemoizedUnstakeSidebar as UnstakeSidebar }
