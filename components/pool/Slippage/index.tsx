import { memo, MouseEvent, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import styles from '../styles/Slippage.module.scss'

import { Icon } from 'components/Icon'
import SlippageMenu from './Menu'

function Slippage() {
  const [show, setShow] = useState(false)

  function toggle(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    setShow((prev) => !prev)
  }

  function close() {
    setShow(false)
  }

  return (
    <div className={styles.slippage}>
      <button
        className={clsx(styles.toggle, { [styles.open]: show })}
        type="button"
        onClick={toggle}
      >
        <Icon id="settings" />
      </button>

      <AnimatePresence>
        {show && <SlippageMenu close={close} />}
      </AnimatePresence>
    </div>
  )
}

export default memo(Slippage)
