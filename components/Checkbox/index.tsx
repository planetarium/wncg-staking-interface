import { ChangeEvent, useEffect, useRef } from 'react'
import { usePrevious } from 'react-use'
import clsx from 'clsx'

import {
  StyledCheckbox,
  StyledCheckboxFakeInput,
  StyledCheckboxInput,
} from './styled'
import Icon from '../Icon'

type CheckboxProps = {
  checked?: boolean
  className?: string
  disabled?: boolean
  id?: string
  onChange?(checked: boolean): void
  $size?: CheckboxSize
}

function Checkbox({
  checked = false,
  onChange,
  className,
  disabled,
  id,
  $size = 24,
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const prevChecked = usePrevious(checked)

  function handleCheck(e: ChangeEvent<HTMLInputElement>) {
    onChange?.(e.currentTarget.checked)
  }

  useEffect(() => {
    if (prevChecked === checked) return
    if (inputRef?.current) {
      inputRef.current.checked = checked
    }
  }, [checked, prevChecked])

  return (
    <StyledCheckbox className={clsx('checkbox', className)} $size={$size}>
      <StyledCheckboxInput
        className="input"
        id={id}
        ref={inputRef}
        type="checkbox"
        defaultChecked={checked}
        onChange={handleCheck}
        disabled={disabled}
      />

      <StyledCheckboxFakeInput className="fakeInput" aria-hidden>
        <Icon icon="check" $size={32} />
      </StyledCheckboxFakeInput>
    </StyledCheckbox>
  )
}

export default Checkbox
