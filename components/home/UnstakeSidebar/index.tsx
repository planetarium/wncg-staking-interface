import { memo } from 'react'
import { useRecoilValue } from 'recoil'
import { motion } from 'framer-motion'

import { legacyModeState } from 'app/states/settings'
import { motionVariants, sidebarTransition } from '../constants'

import { UnstakeSidebarCooldown } from './Cooldown'
import { UnstakeSidebarWithdrawWindow } from './WithdrawWindow'
import { UnstakeSidebarMigration } from './Migration'

type UnstakeSidebarProps = {
  isWithdrawable: boolean
}

function UnstakeSidebar({ isWithdrawable }: UnstakeSidebarProps) {
  const legacyMode = useRecoilValue(legacyModeState)
  const content = isWithdrawable ? (
    <UnstakeSidebarWithdrawWindow />
  ) : (
    <UnstakeSidebarCooldown />
  )

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      transition={sidebarTransition}
      variants={motionVariants}
    >
      {legacyMode ? (
        <UnstakeSidebarMigration isWithdrawable={isWithdrawable} />
      ) : (
        content
      )}
    </motion.div>
  )
}

const MemoizedUnstakeSidebar = memo(UnstakeSidebar)
export { MemoizedUnstakeSidebar as UnstakeSidebar }
