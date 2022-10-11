import { ChangeEvent, useEffect, useRef } from 'react'
import { usePrevious } from 'react-use'
import styled from 'styled-components'

import { flexbox } from 'newStyles/utils'

import SvgIcon from 'new/SvgIcon'

type CheckboxSize = 16 | 24 | 32

const StyledCheckbox = styled.div<{ $size: CheckboxSize }>`
  position: relative;
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  overflow: hidden;
`

const StyledFakeInput = styled.div`
  ${flexbox()};
  width: 100%;
  height: 100%;
  pointer-events: none;

  .check {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80%;
    height: 80%;
    color: var(--primary-400);
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
    transition: 100ms;
  }

  .box {
    width: 100%;
    height: 100%;
  }
`

const StyledInput = styled.input`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: transparent;
  appearance: none;
  cursor: pointer;

  &:checked {
    & + .fakeInput {
      .check {
        opacity: 1;
        visibility: visible;
        transform: translate(-50%, -50%) scale(1);
      }
    }
  }

  &:disabled {
    cursor: not-allowed;

    & + .fakeInput {
      opacity: 0.3;
    }
  }
`

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
    <StyledCheckbox className={className} $size={$size}>
      <StyledInput
        className="input"
        id={id}
        ref={inputRef}
        type="checkbox"
        defaultChecked={checked}
        onChange={handleCheck}
        disabled={disabled}
      />

      <StyledFakeInput className="fakeInput" aria-hidden>
        <SvgIcon className="box" icon="checkboxOff" />
        <SvgIcon className="check" icon="check" />
      </StyledFakeInput>
    </StyledCheckbox>
  )
}

export default Checkbox
