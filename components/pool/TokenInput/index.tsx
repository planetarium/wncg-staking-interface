import type { MouseEvent } from 'react'
import { Control, FieldValues, RegisterOptions } from 'react-hook-form'
import NumberFormat from 'react-number-format'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import styles from '../styles/TokenInput.module.scss'

import { IS_ETHEREUM } from 'utils/env'
import { errorMessageVariants } from 'components/Input/constants'
import type { TokenDropdownSymbol } from '../constants'

import { TokenBaseInput } from './BaseInput'
import { TokenDropdown } from './Dropdown'

type TokenInputProps = {
  balance: string
  control: Control
  id: string
  name: string
  rules: Partial<RegisterOptions>
  token: TokenDropdownSymbol
  disabled?: boolean
  error?: string
  selectToken?(value: TokenDropdownSymbol): void
  setMaxValue?(e: MouseEvent<HTMLButtonElement>): void
  tokenList?: TokenDropdownSymbol[]
}

export function TokenInput({
  balance,
  control,
  name,
  rules,
  token,
  disabled,
  error,
  id,
  selectToken,
  setMaxValue,
  tokenList = [],
}: TokenInputProps) {
  const hasError = !!error
  const hasMaxButton = !!setMaxValue
  const precision = !IS_ETHEREUM && token === 'wncg' ? 8 : 18

  return (
    <div className={styles.tokenInputField}>
      <div
        className={clsx(styles.tokenInputGroup, { [styles.error]: hasError })}
      >
        <div className={styles.control}>
          <TokenDropdown
            id={id}
            currentToken={token}
            selectToken={selectToken}
            tokenList={tokenList}
          />
          <TokenBaseInput
            id={id}
            className={styles.tokenInput}
            name={name}
            control={control as any as Control<FieldValues, 'any'>}
            rules={rules}
            precision={precision}
            disabled={disabled}
          />
        </div>

        <div className={styles.balanceGroup}>
          <span>Balance:</span>
          <strong>
            <NumberFormat
              className={styles.balance}
              decimalScale={precision}
              displayType="text"
              isNumericString
              thousandSeparator={true}
              value={balance}
            />
          </strong>
          {hasMaxButton && (
            <button
              className={styles.maxButton}
              type="button"
              value={name}
              onClick={setMaxValue}
            >
              Max
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
      </AnimatePresence>
    </div>
  )
}
