import { memo } from 'react'
import { useAtomValue } from 'jotai'
import { motion } from 'framer-motion'

import { legacyModeAtom } from 'states/userSettings'
import { motionVariants, sidebarTransition } from '../constants'

import { UnstakeSidebarCooldown } from './Cooldown'
import { UnstakeSidebarWithdrawWindow } from './WithdrawWindow'
import { UnstakeSidebarMigration } from './Migration'

type UnstakeSidebarProps = {
  isWithdrawable: boolean
}

function UnstakeSidebar({ isWithdrawable }: UnstakeSidebarProps) {
  const legacyMode = useAtomValue(legacyModeAtom)

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

export default memo(UnstakeSidebar)
