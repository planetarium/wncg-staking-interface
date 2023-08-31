import { ChangeEvent, useEffect, useRef } from 'react'
import { usePrevious } from 'react-use'
import clsx from 'clsx'

import { StyledRadio, StyledRadioFakeInput, StyledRadioInput } from './styled'

type RadioProps = {
  selected?: boolean
  className?: string
  disabled?: boolean
  id?: string
  name?: string
  onChange?(value: string): void
  value?: string | number
  $size?: RadioSize
}

function Radio({
  selected = false,
  onChange,
  className,
  disabled,
  id,
  name,
  value,
  $size = 16,
}: RadioProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const prevSelected = usePrevious(selected)

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange?.(e.currentTarget.value)
  }

  useEffect(() => {
    if (prevSelected === selected) return
    if (inputRef?.current) {
      inputRef.current.checked = selected
    }
  }, [selected, prevSelected])

  return (
    <StyledRadio className={clsx('radio', className)} $size={$size}>
      <StyledRadioInput
        className="input"
        id={id}
        name={name}
        ref={inputRef}
        type="radio"
        value={value}
        defaultChecked={selected}
        onChange={handleChange}
        disabled={disabled}
      />

      <StyledRadioFakeInput className="fakeInput" aria-hidden>
        <span className={clsx('selector', { selected })} aria-hidden />
      </StyledRadioFakeInput>
    </StyledRadio>
  )
}

export default Radio
