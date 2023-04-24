import { ControllerRenderProps, FieldValues } from 'react-hook-form'

import { StyledRangeInput } from './styled'

type RangeInputProps = {
  id: string
  field: ControllerRenderProps<FieldValues>
  max?: number
  min?: number
  onClick?(): void
  step?: number
  disabled?: boolean
}

export default function RangeInput({
  id,
  field,
  max,
  min,
  onClick,
  step,
  disabled,
}: RangeInputProps) {
  return (
    <StyledRangeInput>
      <input
        id={id}
        type="range"
        {...field}
        step={step}
        min={min}
        max={max}
        onClick={onClick}
        disabled={disabled}
        style={{ backgroundSize: `${field.value}% 100%` }}
      />
    </StyledRangeInput>
  )
}
