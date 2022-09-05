import {
  FocusEvent,
  memo,
  MouseEvent as ReactMouseEvent,
  useCallback,
  useRef,
} from 'react'
import { useMount, useUnmount } from 'react-use'
import NumberFormat from 'react-number-format'
import { useRecoilState } from 'recoil'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import store from 'store'
import styles from '../styles/Slippage.module.scss'

import { slippageState } from 'app/states/settings'
import STORAGE_KEYS from 'constants/storageKeys'
import { menuTransition, menuVariants, SLIPPAGES } from './constants'

type SlippageMenuProps = {
  close(): void
}

function SlippageMenu({ close }: SlippageMenuProps) {
  const [slippage, setSlippage] = useRecoilState(slippageState)
  const menuRef = useRef<HTMLDivElement>(null)

  const customSlippage = !SLIPPAGES.includes(slippage || 0)

  function updateSlippage(value: string | null) {
    const newSlippage = value ? Number(value) : null
    setSlippage(newSlippage)
    store.set(STORAGE_KEYS.UserSettings.Slippage, newSlippage)
  }

  function handleButtonClick(e: ReactMouseEvent<HTMLButtonElement>) {
    updateSlippage(e.currentTarget.value)
  }

  function handleInputBlur(e: FocusEvent<HTMLInputElement>) {
    updateSlippage(e.currentTarget.value)
  }

  function handleInputChange() {
    updateSlippage(null)
  }

  const closeOnBlur = useCallback(
    (e: MouseEvent) => {
      if (!menuRef?.current?.contains(e.target as Node)) {
        close()
        window.removeEventListener('click', closeOnBlur)
      }
    },
    [close]
  )

  useMount(() => {
    window.addEventListener('click', closeOnBlur, { passive: false })
    const storedSlippage = store.get(STORAGE_KEYS.UserSettings.Slippage)
    if (storedSlippage) {
      updateSlippage(storedSlippage)
    }
  })

  useUnmount(() => {
    window.removeEventListener('click', closeOnBlur)
  })

  return (
    <motion.aside
      className={styles.slippageMenu}
      ref={menuRef}
      key="pendingTxMenu"
      variants={menuVariants}
      transition={menuTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <h3 className={styles.title}>Slippage tolerance</h3>

      <div className={styles.buttonGroup}>
        {SLIPPAGES.map((value) => {
          return (
            <button
              className={clsx(styles.button, {
                [styles.selected]: slippage === value,
              })}
              key={`SlippageTolerance.${value}`}
              type="button"
              value={value}
              onClick={handleButtonClick}
            >
              {value}%
            </button>
          )
        })}

        <div
          className={clsx(styles.inputGroup, {
            [styles.selected]: customSlippage,
          })}
        >
          <NumberFormat
            className={styles.input}
            placeholder="0.1"
            decimalScale={4}
            value={slippage}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
          />
          <span className={styles.pcnt}>%</span>
        </div>
      </div>
    </motion.aside>
  )
}

export default memo(SlippageMenu)
