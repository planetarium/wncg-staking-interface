import styled from 'styled-components'

import { flexbox } from 'styles/utils'

export type CheckboxSize = 16 | 24 | 32

export const StyledCheckbox = styled.div<{ $size: CheckboxSize }>`
  position: relative;
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  overflow: hidden;
`

export const StyledCheckboxFakeInput = styled.div`
  ${flexbox()}
  width: 100%;
  height: 100%;
  border: 1.5px solid var(--gray-200);
  border-radius: 4px;
  pointer-events: none;

  .box {
    width: 100%;
    height: 100%;
  }

  .icon {
    &.check {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 80%;
      height: 80%;
      color: var(--white);
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
      transition: 100ms;
    }
  }
`

export const StyledCheckboxInput = styled.input`
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
      .icon.check {
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
