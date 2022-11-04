import { motion } from 'framer-motion'
import styled from 'styled-components'

import {
  flexbox,
  gradient,
  inlineFlexbox,
  posCenter,
  textStyle,
} from 'newStyles/utils'

export const StyledGnb = styled.header`
  ${flexbox('space-between')}
  position: relative;
  width: 100%;
  padding: 16px;
  background-color: var(--primary-900);
  box-shadow: 0 1px 0 0 rgba(var(--white-rgb), 0.2);

  .left,
  .right {
    display: flex;
    align-items: center;
  }

  .logo {
    ${flexbox()}

    a {
      ${inlineFlexbox()}
      padding: 12px;
      font-family: Inter;
      font-weight: 700;
      font-size: 16px;
      line-height: 20px;
      color: var(--white);
    }
  }

  .actionDropdown {
    margin-left: 20px;
  }

  .account {
    margin-left: 20px;
  }
`

export const StyledClaim = styled(motion.div)`
  ${posCenter()}
  ${flexbox()}
  padding: 8px 8px 8px 20px;
  color: var(--white);
  background-image: ${gradient(1)};
  border-radius: 100px;

  .reward {
    ${flexbox()}
    ${textStyle('body', 3)}

    &:last-of-type {
      &::after {
        display: none;
      }
    }

    .usd {
      ${flexbox('flex-start')}
      margin-left: 4px;
      font-weight: 500;
    }

    .symbol {
      margin-left: 4px;
      font-weight: 700;
      color: rgba(var(--white-rgb), 0.6);
    }

    &::after {
      display: block;
      width: 2px;
      height: 16px;
      margin: 0 16px;
      background-color: rgba(var(--white-rgb), 0.4);
      border-radius: 10px;
      content: '';
    }
  }

  .claimButton {
    flex-shrink: 0;
    margin-left: 16px;
  }
`

export const StyledMenuList = styled.nav`
  ul {
    ${flexbox('flex-end')}
  }

  li {
    margin-left: 8px;

    &:first-child {
      margin-left: 0;
    }
  }

  a,
  button {
    ${inlineFlexbox()}
    ${textStyle('body', 3)}
    padding: 8px 12px;
    color: var(--white);
    border-radius: 4px;
    transition: 200ms;

    &:hover {
      background-color: rgba(var(--white-rgb), 0.1);
    }

    .icon {
      color: var(--gray-400);
    }
  }
`
