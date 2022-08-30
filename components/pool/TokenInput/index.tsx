import type { MouseEvent } from 'react'
import { Control, FieldValues, RegisterOptions } from 'react-hook-form'
import NumberFormat from 'react-number-format'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import styles from '../styles/TokenInput.module.scss'

import { getIsMobile } from 'app/states/mediaQuery'
import { bnum, isLessThanMinAmount } from 'utils/num'
import { getTokenInfo } from 'utils/token'
import { errorMessageVariants } from 'components/Input/constants'
import { useAppSelector } from 'hooks'

import { TokenBaseInput } from './BaseInput'
import { TokenDropdown } from './Dropdown'

type TokenInputProps = {
  address: string
  balance: string
  control: Control
  id: string
  maximized: boolean
  name: string
  rules: Partial<RegisterOptions>
  disabled?: boolean
  error?: string
  propButton?: boolean
  selectToken?(value: string): void
  setMaxValue?(e: MouseEvent<HTMLButtonElement>): void
  setPropAmount?(e: MouseEvent<HTMLButtonElement>): void
  tokenList?: string[]
  warning?: string
}

export function TokenInput({
  address,
  balance,
  control,
  maximized,
  name,
  id,
  rules,
  disabled,
  error,
  propButton,
  selectToken,
  setMaxValue,
  setPropAmount,
  tokenList = [],
  warning,
}: TokenInputProps) {
  const isMobile = useAppSelector(getIsMobile)

  const hasError = !!error
  const hasWarning = !!warning
  const showPropButton = propButton && !!setPropAmount
  const { decimals } = getTokenInfo(address)

  return (
    <div className={styles.tokenInputField}>
      <div
        className={clsx(styles.tokenInputGroup, { [styles.error]: hasError })}
      >
        <div className={styles.control}>
          <TokenDropdown
            id={id}
            selectedToken={address}
            selectToken={selectToken}
            tokenList={tokenList}
          />
          <TokenBaseInput
            id={id}
            className={styles.tokenInput}
            name={name}
            control={control as any as Control<FieldValues, 'any'>}
            rules={rules}
            precision={decimals}
            disabled={disabled}
          />
        </div>

        <div className={styles.balanceGroup}>
          <span className={styles.label}>Balance:</span>
          <strong>
            {isLessThanMinAmount(balance) ? (
              <span className={styles.balance}>&lt; 0.0001</span>
            ) : (
              <NumberFormat
                className={styles.balance}
                decimalScale={4}
                displayType="text"
                isNumericString
                thousandSeparator={true}
                value={balance}
              />
            )}
          </strong>

          {!bnum(balance).isZero() && (
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
