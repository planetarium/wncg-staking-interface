import { motion } from 'framer-motion'
import styled from 'styled-components'

import { flexbox, gradient, inlineFlexbox, textStyle } from 'newStyles/utils'
import { buttonStyle } from 'new/Button/styled'

export const StyledAccountConnect = styled.div`
  ${flexbox()}

  button {
    ${textStyle('button', 2)}
    width: 204px;
    height: 56px;
    font-weight: 700;
    border-radius: 8px;
  }
`

export const StyledAccountDropdownMenu = styled(motion.aside)`
  position: absolute;
  z-index: 100;
  top: calc(100% + 16px);
  right: 0;
  width: 360px;
  padding: 24px;
  overflow: hidden;
  background-color: var(--white);
  border-radius: 8px;

  .header {
    margin-bottom: 24px;

    h2 {
      ${flexbox('flex-start')}
      margin-bottom: 24px;
    }
  }

  .avatar {
    flex-shrink: 0;
    margin-right: 12px;
  }

  .address {
    ${textStyle('body', 2)}
    font-weight: 700;
    color: var(--gray-900);
  }

  .utils {
    ${flexbox('space-between')}

    a,
    button {
      ${buttonStyle}
      ${inlineFlexbox()}
      ${textStyle('body', 4)}
      width: 150px;
      padding: 12px 0;
      color: var(--gray-500);
      background-color: var(--gray-100);
      border-radius: 4px;
    }

    .icon {
      flex-shrink: 0;
      margin-left: 8px;
    }
  }

  .detail {
    ${textStyle('body', 3)}
    margin-bottom: 24px;
  }

  .detailItem {
    ${flexbox('space-between')}
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }

    dt {
      color: var(--gray-500);
    }

    dd {
      ${flexbox('flex-end')}
      font-weight: 700;
      color: var(--gray-900);
      text-align: right;
    }

    .dot {
      display: block;
      width: 8px;
      height: 8px;
      margin-right: 12px;
      background-color: var(--primary-500);
      border-radius: 50%;
      box-shadow: 0px 4px 12px rgba(var(--primary-600-rgb), 0.4);
    }
  }
`

export const StyledAccountDropdownToggle = styled.button`
  ${buttonStyle}
  width: 204px;
  height: 56px;
  color: var(--white);
  background-color: rgba(var(--white-rgb), 0.1);
  border-radius: 8px;

  &:hover {
    &::before {
      opacity: 1;
    }
  }

  .avatar,
  .icon {
    flex-grow: 0;
    flex-shrink: 0;
  }

  .avatar {
    margin-right: 12px;
  }

  .address {
    ${textStyle('body', 2)}
    max-width: 110px;
    flex-grow: 1;
    font-weight: 700;
  }

  .icon {
    margin-left: 4px;
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
    background-image: ${gradient(5)};
    background-position: center center;
    background-size: 100% 100%;
    content: '';
  }
`
