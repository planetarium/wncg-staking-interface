import type { ControllerRenderProps, FieldValues } from 'react-hook-form'

import { StyledRangeInput } from './styled'

type RangeInputProps = {
  disabled: boolean
  field: ControllerRenderProps<FieldValues>
  id?: string
}

function RangeInput({ disabled, field, id }: RangeInputProps) {
  const { ref, value, ...fieldProps } = field

  return (
    <StyledRangeInput className="rangeInput" $disabled={disabled}>
      <input
        {...fieldProps}
        id={id}
        className="input"
        type="range"
        value={value}
        style={{ backgroundSize: `${value}% 100%` }}
      />
    </StyledRangeInput>
  )
}

export default RangeInput
