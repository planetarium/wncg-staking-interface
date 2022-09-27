import { useRecoilValue } from 'recoil'
import clsx from 'clsx'
import styles from './styles/Header.module.scss'

import { connectedState } from 'app/states/connection'
import { legacyModeState } from 'app/states/settings'
import { useSettings, useStakedBalance } from 'hooks'

export function Toggle() {
  const { toggleLegacyMode } = useSettings()
  const { hasBalanceInLegacyContract } = useStakedBalance()

  const isConnected = useRecoilValue(connectedState)
  const legacyMode = useRecoilValue(legacyModeState)

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
