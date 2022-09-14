import type { MouseEvent } from 'react'
import { Control, FieldValues, RegisterOptions } from 'react-hook-form'
import NumberFormat from 'react-number-format'
import { useRecoilValue } from 'recoil'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import styles from '../styles/TokenInput.module.scss'

import { isMobileState } from 'app/states/mediaQuery'
import { bnum, isLessThanMinAmount } from 'utils/num'
import { getTokenInfo } from 'utils/token'
import { errorMessageVariants } from 'components/Input/constants'

import { TokenBaseInput } from './BaseInput'
import { TokenDropdown } from './Dropdown'
import { TokenLabel } from './Label'

type TokenInputProps = {
  action: PoolAction
  address: string
  control: Control
  id: string
  max: string
  maximized: boolean
  name: string
  disabled?: boolean
  error?: string
  propButton?: boolean
  rules?: Partial<RegisterOptions>
  selectToken?(value: string): void
  setMaxValue?(e: MouseEvent<HTMLButtonElement>): void
  setPropAmount?(e: MouseEvent<HTMLButtonElement>): void
  showLabel?: boolean
  tokenList?: string[]
  warning?: string
}

export function TokenInput({
  action,
  address,
  control,
  max,
  maximized,
  name,
  id,
  disabled,
  error,
  propButton,
  selectToken,
  setMaxValue,
  setPropAmount,
  rules = {},
  showLabel = false,
  tokenList = [],
  warning,
}: TokenInputProps) {
  const isMobile = useRecoilValue(isMobileState)

  const hasError = !!error
  const hasDropdown = !!tokenList.length && !!selectToken
  const hasLabel = showLabel
  const hasWarning = !!warning
  const showPropButton = propButton && !!setPropAmount
  const { decimals } = getTokenInfo(address)

  return (
    <div className={styles.tokenInputField}>
      <div
        className={clsx(styles.tokenInputGroup, { [styles.error]: hasError })}
      >
        <div className={styles.control}>
          {hasDropdown && (
            <TokenDropdown
              id={id}
              list={tokenList}
              selected={address}
              select={selectToken}
            />
          )}
          {hasLabel && <TokenLabel address={address} />}

          <TokenBaseInput
            id={id}
            className={clsx(styles.tokenInput)}
            name={name}
            control={control as any as Control<FieldValues, 'any'>}
            rules={rules}
            precision={decimals}
            disabled={disabled}
          />
        </div>

        <div className={styles.balanceGroup}>
          <span className={styles.label}>
            {action === 'join' ? 'Balance' : 'Single token max'}:
          </span>
          <strong>
            {isLessThanMinAmount(max) ? (
              <span className={styles.balance}>&lt; 0.0001</span>
            ) : (
              <NumberFormat
                className={styles.balance}
                decimalScale={4}
                displayType="text"
                isNumericString
                thousandSeparator={true}
                value={max}
              />
            )}
          </strong>

          {!bnum(max).isZero() && (
            <button
              className={styles.maxButton}
              type="button"
              value={name}
              onClick={setMaxValue}
              disabled={maximized}
            >
              {maximized ? 'Maxed' : 'Max'}
            </button>
          )}

          {showPropButton && (
            <button
              className={styles.propButton}
              type="button"
              value={name}
              onClick={setPropAmount}
            >
              {isMobile ? 'suggestion' : 'proportional suggestion'}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {hasError && (
          <motion.p
            className={styles.errorMessage}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={errorMessageVariants}
          >
            {error}
          </motion.p>
        )}

        {hasWarning && (
          <motion.p
            className={styles.warningMessage}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={errorMessageVariants}
          >
            {warning}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
