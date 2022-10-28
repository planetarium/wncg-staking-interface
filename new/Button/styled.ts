import styled, { css } from 'styled-components'

import { flexbox, gradient, inlineFlexbox, textStyle } from 'newStyles/utils'

export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'text'
  | 'tiny'

export type StyledButtonProps = {
  $variant: ButtonVariant
  $contain: boolean
  $size?: ButtonSize
}

// NOTE: Button default style
export const buttonStyle = css`
  ${flexbox()}
  position: relative;
  isolation: isolate;
  overflow: hidden;
  cursor: pointer;
  transition: 500ms;

  &:hover {
    &::before {
      opacity: 1;
    }
  }

  &:disabled,
  &.disabled {
    cursor: not-allowed;

    &::before {
      display: none;
    }
  }

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    pointer-events: none;
    transition: 250ms;
    background-position: center center;
    background-size: 100% 100%;
  }
`

// NOTE: Button variants
export const primaryButtonStyle = css`
  color: var(--white);
  background-color: var(--primary-500);

  &:disabled,
  &.disabled {
    color: rgba(var(--white-rgb), 0.5);
    background-color: rgba(250, 241, 237, 0.1);
  }

  &::before {
    background-image: ${gradient(2)};
    content: '';
  }
`

export const secondaryButtonStyle = css`
  color: var(--primary-700);
  background-color: var(--primary-50);

  &:disabled,
  &.disabled {
    color: var(--gray-500);
    background-color: var(--gray-200);
  }

  &::before {
    background-image: ${gradient(3)};
    border-radius: 8px;
    content: '';
  }
`

export const tertiaryButtonStyle = css`
  color: var(--white);
  background-color: rgba(var(--white-rgb), 0.1);

  &:disabled,
  &.disabled {
    color: rgba(var(--white), 0.5);
  }
`

export const textButtonStyle = css`
  ${inlineFlexbox('flex-start', 'center')}
  ${textStyle('button', 2)}
  width: auto;
  color: var(--white);

  .label {
    text-align: left;
  }
`

export const tinyButtonStyle = css`
  ${inlineFlexbox('flex-start', 'center')}
  ${textStyle('button', 3)}
  width: auto;
  padding: 8px 16px;
  color: var(--white);
  background-color: rgba(var(--white-rgb), 0.1);
  border-radius: 100px;
`

// NOTE: Button sizes
export const lgButtonStyle = css`
  ${textStyle('button', 1)}
  height: 72px;
  padding: 0 24px;
  border-radius: 8px;

  .leftIcon,
  .rightIcon {
    width: 32px;
    height: 32px;
  }

  .leftIcon {
    margin-right: 8px;
  }

  .rightIcon {
    margin-left: 8px;
  }
`

export const mdButtonStyle = css`
  ${textStyle('button', 2)}
  height: 48px;
  padding: 0 16px;
  border-radius: 8px;

  .leftIcon,
  .rightIcon {
    width: 32px;
    height: 32px;
  }

  .leftIcon {
    margin-right: 8px;
  }

  .rightIcon {
    margin-left: 8px;
  }
`

export const smButtonStyle = css`
  ${textStyle('button', 3)}
  height: 32px;
  padding: 0 16px;
  border-radius: 4px;

  .leftIcon,
  .rightIcon {
    width: 24px;
    height: 24px;
  }

  .leftIcon {
    margin-right: 4px;
  }

  .rightIcon {
    margin-left: 4px;
  }
`

export const StyledButton = styled.div<StyledButtonProps>`
  ${buttonStyle}
  width: ${({ $contain }) => ($contain ? 'auto' : '100%')};

  .leftIcon,
  .rightIcon,
  .label {
    position: relative;
  }

  .leftIcon,
  .rightIcon {
    flex-shrink: 0;
    pointer-events: none;
    user-select: none;
  }

  .label {
    flex-grow: 1;
    text-align: center;
    white-space: nowrap;
  }

  ${({ $variant }) => $variant === 'primary' && primaryButtonStyle}
  ${({ $variant }) => $variant === 'secondary' && secondaryButtonStyle}
  ${({ $variant }) => $variant === 'tertiary' && tertiaryButtonStyle}
  ${({ $variant }) => $variant === 'text' && textButtonStyle}
  ${({ $variant }) => $variant === 'tiny' && tinyButtonStyle}

  ${({ $size }) => $size === 'lg' && lgButtonStyle}
  ${({ $size }) => $size === 'md' && mdButtonStyle}
  ${({ $size }) => $size === 'sm' && smButtonStyle}
`
