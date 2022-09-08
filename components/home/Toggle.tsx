import { useRecoilValue } from 'recoil'
import clsx from 'clsx'
import styles from './styles/Header.module.scss'

import { legacyModeState } from 'app/states/settings'
import { useSettings } from 'hooks'

export function Toggle() {
  const { toggleLegacyMode } = useSettings()
  const legacyMode = useRecoilValue(legacyModeState)

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
