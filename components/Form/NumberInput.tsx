import { FocusEvent, MouseEvent, useMemo, useRef, useState } from 'react'
import type { ControllerRenderProps, FieldValues } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { AnimatePresence, motion } from 'framer-motion'
import { useDebounce } from 'use-debounce'

import { EXIT_MOTION } from 'config/motions'
import { fadeIn } from 'config/motionVariants'
import { bnum } from 'utils/bnum'
import { useFiat } from 'hooks'

import { StyledNumberInput } from './styled'
import NumberFormat from 'components/NumberFormat'

type NumberInputProps = {
  decimals: number
  disabled: boolean
  field: ControllerRenderProps<FieldValues>
  setMaxValue(e: MouseEvent<HTMLButtonElement>): void
  address?: Hash
  id?: string
  onClick?(): void
  onMaxButtonBlur?(e?: FocusEvent): void
  placeholder?: string
  showFiatValue?: boolean
  $error: boolean
  $size: InputSize
}

export default function NumberInput({
  decimals,
  disabled,
  field,
  setMaxValue,
  address,
  id,
  onClick,
  onMaxButtonBlur,
  placeholder,
  showFiatValue = false,
  $error,
  $size,
}: NumberInputProps) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLDivElement>(null)

  const { ref, ...fieldProps } = field
  const toFiat = useFiat()

  const fiatValue = useMemo(() => {
    if (!showFiatValue || !address) return
    return toFiat(bnum(fieldProps.value).toString(), address)
  }, [address, fieldProps.value, showFiatValue, toFiat])

  const [debouncedFiatValue] = useDebounce(fiatValue, 500)

  const showTooltip =
    showFiatValue && debouncedFiatValue && bnum(debouncedFiatValue).gt(0)

  function onBlur() {
    setFocused(false)
  }

  function onFocus() {
    setFocused(true)
  }

  return (
    <StyledNumberInput
      ref={inputRef}
      className="baseInput"
      $disabled={disabled}
      $error={$error}
      $size={$size}
      $focused={focused}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            {...EXIT_MOTION}
            className="tooltip"
            variants={fadeIn}
            transition={{ duration: 0.1 }}
          >
            <NumberFormat value={debouncedFiatValue} type="fiat" />
          </motion.div>
        )}
      </AnimatePresence>

      <NumericFormat
        {...fieldProps}
        id={id}
        className="input"
        allowNegative={false}
        decimalScale={decimals}
        valueIsNumericString
        thousandSeparator={true}
        disabled={disabled}
        onClick={onClick}
        placeholder={placeholder}
        autoComplete="off"
      />
      <button
        className="maxButton"
        type="button"
        onClick={setMaxValue}
        onBlur={onMaxButtonBlur}
        disabled={disabled}
        aria-label="Enter maximum value"
      >
        max
      </button>
    </StyledNumberInput>
  )
}
