import { useRecoilValue, useSetRecoilState } from 'recoil'
import clsx from 'clsx'
import styles from './styles/Header.module.scss'

import { legacyModeState } from 'app/states/settings'

export function Toggle() {
  const legacyMode = useRecoilValue(legacyModeState)
  const setLegacyMode = useSetRecoilState(legacyModeState)

  function handleClick() {
    setLegacyMode((prev) => !prev)
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
        onClick={handleClick}
      >
        <span className={styles.knob}>{legacyMode ? 'off' : 'on'}</span>
      </button>
    </div>
  )
}
