import Link from 'next/link'
import styled, { css } from 'styled-components'

import { assertUnreachable } from 'utils/assertUnreachable'
import { flexbox, gradient, inlineFlexbox, textStyle } from 'styles/utils'

export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary'

export type StyledButtonProps = {
  $variant: ButtonVariant
  $contain: boolean
  $size?: ButtonSize
}

export const buttonStyle = css`
  ${flexbox()}
  position: relative;
  isolation: isolate;
  overflow: hidden;
  cursor: pointer;
  transition: 500ms;

  &:not(:disabled):hover {
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

  .leftIcon,
  .rightIcon,
  .label {
    position: relative;
  }

  .leftIcon,
  .rightIcon {
    ${inlineFlexbox()}
    flex-shrink: 0;
    pointer-events: none;
    user-select: none;
  }

  .label {
    ${flexbox()}
    flex-grow: 1;
    text-align: center;
    white-space: nowrap;

    .icon {
      margin-left: 8px;
    }
  }
`

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
  color: var(--primary-600);
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

export const outlinedButtonStyle = css`
  color: var(--primary-200);
  background-color: var(--realBlack-rgb);
  border: 1.5px solid var(--primary-400);

  &:not(:disabled):hover {
    background-color: rgba(var(--white-rgb), 0.1);
  }

  &:disabled,
  &.disabled {
    color: rgba(var(--white-rgb), 0.5);
    background-color: transparent !important;
    border-color: rgba(var(--white-rgb), 0.5);
  }
`

export const tertiaryButtonStyle = css`
  color: var(--white);
  background-color: rgba(var(--white-rgb), 0.1);

  &:not(:disabled):hover {
    background-color: transparent;
  }

  &:disabled,
  &.disabled {
    color: rgba(var(--white-rgb), 0.5);
  }

  &::before {
    background-image: ${gradient(6)};
    content: '';
  }
`

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
    width: 16px;
    height: 16px;
  }

  .leftIcon {
    margin-right: 4px;
  }

  .rightIcon {
    margin-left: 4px;
  }
`

function buttonVariantStyle($variant: ButtonVariant) {
  switch ($variant) {
    case 'primary':
      return primaryButtonStyle
    case 'secondary':
      return secondaryButtonStyle
    case 'tertiary':
      return tertiaryButtonStyle
    default:
      assertUnreachable($variant)
  }
}

function buttonSizeStyle($size?: ButtonSize) {
  if (!$size) return

  switch ($size) {
    case 'lg':
      return lgButtonStyle
    case 'md':
      return mdButtonStyle
    case 'sm':
      return smButtonStyle
    default:
      assertUnreachable($size)
  }
}

export const StyledButton = styled.button<StyledButtonProps>`
  ${buttonStyle}
  width: ${({ $contain }) => ($contain ? 'auto' : '100%')};

  ${({ $variant }) => buttonVariantStyle($variant)}
  ${({ $size }) => buttonSizeStyle($size)}
`

export const StyledLink = styled(Link)<StyledButtonProps>`
  ${buttonStyle}
  width: ${({ $contain }) => ($contain ? 'auto' : '100%')};

  ${({ $variant }) => buttonVariantStyle($variant)}
  ${({ $size }) => buttonSizeStyle($size)}
`
