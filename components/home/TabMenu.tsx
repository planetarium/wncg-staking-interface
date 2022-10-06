import { Dispatch, memo, MouseEvent, SetStateAction, useMemo } from 'react'
import clsx from 'clsx'
import styles from './styles/TabMenu.module.scss'

import { useUnstakeTimestamps } from 'hooks'
import { Tab, TabId, TabPanelId } from './constants'

type TabMenuProps = {
  setTab: Dispatch<SetStateAction<Tab>>
  tab: Tab
}

function TabMenu({ setTab, tab }: TabMenuProps) {
  const { refetchTimestamps } = useUnstakeTimestamps()

  const nestedClassName = useMemo(
    () => clsx(styles.tabMenu, { [styles.unstake]: tab === Tab.Unstake }),
    [tab]
  )

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    setTab(e.currentTarget.value as Tab)
    refetchTimestamps()
  }

  return (
    <div className={nestedClassName} role="tablist">
      <button
        className={styles.tab}
        type="button"
        id={TabId.Stake}
        value={Tab.Stake}
        onClick={handleClick}
        aria-controls={TabPanelId.Stake}
        aria-selected={tab === Tab.Stake}
        role="tab"
      >
        Stake
      </button>
      <button
        className={styles.tab}
        type="button"
        id={TabId.Unstake}
        value={Tab.Unstake}
        onClick={handleClick}
        aria-controls={TabPanelId.Unstake}
        aria-selected={tab === Tab.Unstake}
        role="tab"
      >
        Unstake
      </button>
    </div>
  )
}

const MemoizedTabMenu = memo(TabMenu)
export { MemoizedTabMenu as TabMenu }
