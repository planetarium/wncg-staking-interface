import { useAtomValue } from 'jotai'
import clsx from 'clsx'
import styles from './styles/Header.module.scss'

import { legacyModeAtom } from 'states/userSettings'
import { useAccount, useSettings, useStakedBalance } from 'hooks'

export function Toggle() {
  const { isConnected } = useAccount()
  const { toggleLegacyMode } = useSettings()
  const { hasBalanceInLegacyContract } = useStakedBalance()

  const legacyMode = useAtomValue(legacyModeAtom)

  const hideToggle = !isConnected || !hasBalanceInLegacyContract

  if (hideToggle) {
    return null
  }

  return (
    <div className={styles.toggle}>
      <label
        className={clsx(styles.label, { [styles.off]: legacyMode })}
        htmlFor="contractToggle"
      >
        {legacyMode ? 'Old Contract' : 'NEW Contract'}
      </label>

      <button
        id="contractToggle"
        className={clsx(styles.toggleButton, { [styles.off]: legacyMode })}
        type="button"
        onClick={toggleLegacyMode}
      >
        <span className={styles.knob}>{legacyMode ? 'off' : 'on'}</span>
      </button>
    </div>
  )
}
