import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import dynamic from 'next/dynamic'
import { AnimatePresence } from 'framer-motion'
import styles from './styles/Content.module.scss'

import { legacyModeState } from 'app/states/settings'
import { useUnstakeTimestamps } from 'hooks'
import { UnstakeStatus } from 'hooks/useUnstakeTimestamps'
import { Tab } from './constants'

import { StakeForm } from './StakeForm'
import { StakeSidebar } from './StakeSidebar'
import { TabMenu } from './TabMenu'

const UnstakeForm = dynamic(() => import('./UnstakeForm'))
const UnstakeSidebar = dynamic(() => import('./UnstakeSidebar'))

export function Content() {
  const { unstakeStatus } = useUnstakeTimestamps()
  const [tab, setTab] = useState<Tab>(Tab.Stake)

  const legacyMode = useRecoilValue(legacyModeState)

  const isWithdrawable = unstakeStatus === UnstakeStatus.Withdrawable

  useEffect(() => {
    setTab(Tab.Stake)
  }, [legacyMode])

  return (
    <div className={styles.content}>
      <div className={styles.form}>
        <TabMenu setTab={setTab} tab={tab} />

        <AnimatePresence>
          {tab === Tab.Stake ? (
            <StakeForm />
          ) : (
            <UnstakeForm disabled={!isWithdrawable} />
          )}
        </AnimatePresence>
      </div>

      <div className={styles.sidebar}>
        <AnimatePresence>
          {tab === Tab.Stake ? (
            <StakeSidebar />
          ) : (
            <UnstakeSidebar isWithdrawable={isWithdrawable} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
