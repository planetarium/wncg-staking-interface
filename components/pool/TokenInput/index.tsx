import type { MouseEvent } from 'react'
import { Control, FieldValues, RegisterOptions } from 'react-hook-form'
import NumberFormat from 'react-number-format'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import styles from '../styles/TokenInput.module.scss'

import { getIsMobile } from 'app/states/mediaQuery'
import { IS_ETHEREUM } from 'utils/env'
import Decimal from 'utils/num'
import { errorMessageVariants } from 'components/Input/constants'
import { useAppSelector } from 'hooks'
import type { TokenDropdownSymbol } from '../constants'

import { TokenBaseInput } from './BaseInput'
import { TokenDropdown } from './Dropdown'

type TokenInputProps = {
  balance: string
  control: Control
  id: string
  maximized: boolean
  name: string
  rules: Partial<RegisterOptions>
  token: TokenDropdownSymbol
  disabled?: boolean
  error?: string
  propButton?: boolean
  selectToken?(value: TokenDropdownSymbol): void
  setMaxValue?(e: MouseEvent<HTMLButtonElement>): void
  setPropAmount?(e: MouseEvent<HTMLButtonElement>): void
  tokenList?: TokenDropdownSymbol[]
}

export function TokenInput({
  balance,
  control,
  maximized,
  name,
  id,
  rules,
  token,
  disabled,
  error,
  propButton,
  selectToken,
  setMaxValue,
  setPropAmount,
  tokenList = [],
}: TokenInputProps) {
  const isMobile = useAppSelector(getIsMobile)

  const hasError = !!error
  const showPropButton = propButton && !!setPropAmount
  const precision = !IS_ETHEREUM && token === 'wncg' ? 8 : 18

  const tokenBalance = new Decimal(balance)
  const lessThanMinAmount = !tokenBalance.isZero() && tokenBalance.lt(0.0001)

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
          <span className={styles.label}>Balance:</span>
          <strong>
            {lessThanMinAmount ? (
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
          <button
            className={styles.maxButton}
            type="button"
            value={name}
            onClick={setMaxValue}
            disabled={maximized}
          >
            {maximized ? 'Maxed' : 'Max'}
          </button>
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
      </AnimatePresence>
    </div>
  )
}
