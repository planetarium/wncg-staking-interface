import { useState } from 'react'
import { useMount } from 'react-use'
import { AnimatePresence } from 'framer-motion'
import store from 'store'
import styles from './styles/Content.module.scss'

import { STORE_IS_UNSTAKE_WINDOW_KEY } from 'app/states/unstake'
import { useWithdrawable } from './useWithdrawable'
import { Tab } from './constants'

import { StakeForm } from './StakeForm'
import { StakeSidebar } from './StakeSidebar'
import { UnstakeForm } from './UnstakeForm'
import { UnstakeSidebar } from './UnstakeSidebar'
import { TabMenu } from './TabMenu'

export function Content() {
  const [tab, setTab] = useState<Tab>(Tab.Stake)
  const { isWithdrawable } = useWithdrawable()

  useMount(() => {
    const isUnstakeWindow = store.get(STORE_IS_UNSTAKE_WINDOW_KEY)
    if (isUnstakeWindow) {
      setTab(isUnstakeWindow ? Tab.Unstake : Tab.Stake)
    }
  })

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
