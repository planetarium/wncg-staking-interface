import { ChangeEvent, useEffect, useMemo, useRef } from 'react'
import { usePrevious } from 'react-use'
import clsx from 'clsx'
import styles from './style.module.scss'

import { Icon } from 'components/Icon'

type CheckboxVariant = 'light' | 'dark'

type CheckboxProps = {
  checked: boolean
  onChange(checked: boolean): void
  className?: string
  disabled?: boolean
  id?: string
  variant?: CheckboxVariant
}

export function Checkbox({
  checked,
  onChange,
  className,
  disabled,
  id,
  variant = 'dark',
}: CheckboxProps) {
  const checkboxRef = useRef<HTMLInputElement>(null)
  const prevChecked = usePrevious(checked)

  function handleCheck(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.currentTarget.checked)
  }

  const nestedClassName = useMemo(
    () =>
      clsx(styles.checkboxWrapper, className, {
        [styles.light]: variant === 'light',
        [styles.disabled]: !!disabled,
      }),
    [className, disabled, variant]
  )

  useEffect(() => {
    if (prevChecked !== checked) {
      if (checkboxRef?.current) {
        checkboxRef.current.checked = checked
      }
    }
  }, [checked, prevChecked])

  return (
    <div className={nestedClassName}>
      <input
        className={styles.input}
        id={id}
        ref={checkboxRef}
        type="checkbox"
        checked={checked}
        onChange={handleCheck}
        disabled={disabled}
      />
      <div className={styles.fakeInput}>
        <Icon className={styles.icon} id="check" />
      </div>
    </div>
  )
}
