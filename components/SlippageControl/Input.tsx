import { useCallback } from 'react'
import { Controller } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'

import { MAX_SLIPPAGE } from 'config/constants/liquidityPool'
import { bnum } from 'utils/bnum'
import { SlippageControlField, UseSlippageFormReturn } from './useSlippageForm'

import { StyledSlippageControlInput } from './styled'
import ErrorMessage from 'components/Form/ErrorMessage'
import Icon from 'components/Icon'

type SlippageControlInputProps = UseSlippageFormReturn
export default function SlippageControlInput({
  isCustomValue,
  slippageInput,
  rules,
  control,
  currentValue,
}: SlippageControlInputProps) {
  const selected =
    isCustomValue &&
    bnum(slippageInput).eq(currentValue) &&
    !bnum(slippageInput).isZero()

  const renderer = useCallback(
    ({
      field,
      fieldState,
      formState,
    }: ControlRendererProps<SlippageControlField>) => {
      const { ref, ...fieldProps } = field
      const hasError = Object.keys(formState.errors).length > 0

      return (
        <StyledSlippageControlInput $active={selected} $error={hasError}>
          <div>
            <NumericFormat
              {...fieldProps}
              getInputRef={ref}
              className="input"
              placeholder="0.0%"
              suffix="%"
              max={MAX_SLIPPAGE}
              valueIsNumericString
              allowNegative={false}
            />
            <ErrorMessage
              disabled={false}
              error={fieldState.error?.message}
              icon
            />
          </div>
          <Icon icon="check" />
        </StyledSlippageControlInput>
      )
    },
    [selected]
  )

  return (
    <Controller
      name="slippage"
      control={control}
      rules={rules}
      render={renderer}
    />
  )
}
