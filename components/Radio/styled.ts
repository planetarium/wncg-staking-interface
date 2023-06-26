import styled from 'styled-components'

import { flexbox, posCenter } from 'styles/utils'

export type RadioSize = 16 | 24 | 32

export const StyledRadio = styled.div<{ $size: RadioSize }>`
  position: relative;
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  overflow: hidden;
`

export const StyledRadioFakeInput = styled.div`
  ${flexbox()}
  position: relative;
  width: 100%;
  height: 100%;
  border: 1.5px solid var(--gray-200);
  border-radius: 100px;
  pointer-events: none;

  .box {
    width: 100%;
    height: 100%;
  }

  .selector {
    ${posCenter()}
    width: 80%;
    height: 80%;
    border-radius: 50%;
    background-color: var(--primary-500);
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
    transition: 100ms;

    &.selected {
      opacity: 1;
    }
  }
`

export const StyledRadioInput = styled.input`
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
