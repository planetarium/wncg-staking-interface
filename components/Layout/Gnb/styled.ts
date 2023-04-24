import Link from 'next/link'
import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import {
  GNB_DROPDOWN_MENU_WIDTH,
  GNB_HEIGHT_MOBILE,
  GNB_HEIGHT_TABLET,
  GNB_HEIGHT_DESKTOP,
  GUTTER_MOBILE,
  GUTTER_TABLET,
} from 'styles/constants/dimensions'
import {
  flexbox,
  gradient,
  inlineFlexbox,
  media,
  posCenter,
  textStyle,
} from 'styles/utils'

import { buttonStyle } from 'components/Button/styled'
import { fontFamily } from 'styles/constants/typography'

export const StyledGnb = styled.header`
  ${flexbox('between')}
  position: relative;
  z-index: 10;
  width: 100%;
  height: ${GNB_HEIGHT_MOBILE}px;
  padding: 0 ${GUTTER_MOBILE}px;
  box-shadow: 0 1px 0 0 rgba(var(--white-rgb), 0.2);

  .left,
  .right {
    ${flexbox('start')}
    position: relative;
  }

  .logo {
    a {
      ${flexbox()}
      font-family: ${fontFamily.display};
      font-size: 24px;
      font-weight: 800;
      line-height: 1;
    }

    svg {
      width: 140px;
      height: 40px;
      margin-left: -12px;
    }
  }

  .account {
    position: relative;
  }

  ${media(
    'minTablet',
    css`
      height: ${GNB_HEIGHT_TABLET}px;
      padding-right: ${GUTTER_TABLET / 2}px;
      padding-left: ${GUTTER_TABLET - 20}px;
    `
  )}

  ${media(
    'minLaptop',
    css`
      padding: 0 16px;
    `
  )}

  ${media(
    'minDesktop',
    css`
      height: ${GNB_HEIGHT_DESKTOP}px;

      .logo {
        svg {
          width: 150px;
          height: 44px;
        }
      }
    `
  )}
`

export const StyledRootGnb = styled(StyledGnb)`
  .logo {
    a {
      ${textStyle('body', 1, 700)}
      text-transform: uppercase;
    }
  }
`

export const StyledGnbAccountMenu = styled(motion.aside)`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: ${GNB_DROPDOWN_MENU_WIDTH}px;
  padding: 24px;
  overflow: hidden;
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.48);

  .header {
    margin-bottom: 24px;

    h2 {
      ${flexbox('start')}
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
    ${flexbox('between')}

    .copied {
      .text {
        text-align: right;
        color: var(--gray-500);
      }
    }

    a,
    button {
      ${buttonStyle}
      ${inlineFlexbox()}
      ${textStyle('body', 4)}
      width: 150px;
      padding: 12px 16px;
      margin-left: 12px;
      color: var(--gray-600);
      background-color: var(--gray-100);
      border-radius: 4px;

      &:first-child {
        margin-left: 0;
      }
    }

    .icon {
      flex-shrink: 0;
      margin-left: 8px;
      color: var(--gray-500);
    }

    .text {
      flex-grow: 1;
    }
  }

  .detailList {
    ${textStyle('body', 3)}
    margin-bottom: 24px;
  }

  .detailItem {
    ${flexbox('between')}
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }

    dt {
      color: var(--gray-500);
    }

    dd {
      ${flexbox('end')}
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

export const StyledGnbClaimableRewards = styled(motion.div)`
  ${posCenter()}
  ${flexbox()}
  padding: 8px 8px 8px 20px;
  color: var(--white);
  background-image: ${gradient(1)};
  border-radius: 100px;

  .parenthesis {
    ${flexbox('start')}
    margin-left: 4px;
  }

  .reward {
    ${flexbox()}
    ${textStyle('body', 3, 700)}

    &:first-of-type {
      &::before {
        display: none;
      }
    }

    &::before {
      display: block;
      width: 2px;
      height: 16px;
      margin: 0 16px;
      content: '';
      background-color: rgba(var(--white-rgb), 0.4);
      border-radius: 16px;
    }

    .tokenIcon {
      margin-right: 8px;
    }

    .approx {
      ${flexbox('start')}
      font-weight: 500;
    }

    .symbol {
      ${textStyle('caption')}
      margin-left: 4px;
      font-weight: 700;
      color: rgba(var(--white-rgb), 0.6);
    }

    .plus {
      &::before {
        margin-left: 0;
      }
    }
  }

  .claimButton {
    flex-shrink: 0;
    margin-left: 16px;
    border-radius: 50px;

    &.disabled,
    &:disabled {
      opacity: 0.5;
    }
  }

  .tooltipGroup {
    display: none;
  }

  ${media(
    'minLaptop',
    css`
      .tooltipGroup {
        display: block;
        height: 16px;
        margin-left: 4px;
      }
    `
  )}
`

export const StyledGnbConnectButton = styled(motion.div)`
  ${flexbox()}
  width: 204px;

  button {
    width: 100%;
    height: 48px;
  }

  .accountButton {
    ${flexbox()}
    ${textStyle('body', 2)}
    padding: 0 16px;
    font-weight: 700;
    color: var(--white);
    border-radius: 8px;
    background-color: rgba(var(--white-rgb), 0.1);

    .jazzicon {
      margin-right: 12px;
    }

    .icon {
      margin-left: 4px;
    }
  }

  .address {
    max-width: 110px;
  }

  ${media(
    'minLaptop',
    css`
      .accountButton {
        padding: 0;
      }
    `
  )}

  ${media(
    'minDesktop',
    css`
      button {
        height: 56px;
      }
    `
  )}

  ${media(
    'maxLaptop',
    css`
      display: none;
    `
  )}
`

export const StyledGnbMenuButton = styled(motion.button)`
  ${inlineFlexbox()}
  width: 32px;
  height: 32px;
  margin-left: 16px;
  color: var(--white);

  ${media(
    'minLaptop',
    css`
      display: none;
    `
  )}
`

export const StyledGnbMenuList = styled(motion.ul)`
  ${flexbox('end')}
  margin-right: 16px;

  li {
    margin-left: 8px;

    &:first-child {
      margin-left: 0;
    }

    a,
    button {
      ${inlineFlexbox()}
      ${textStyle('body', 3)}
      padding: 8px 12px;
      color: var(--white);
      border-radius: 4px;
      transition: 150ms;

      &:hover {
        background-color: rgba(var(--white-rgb), 0.05);
      }
    }

    .textButton,
    .iconButton {
      transition: 150ms;
    }

    .textButton {
      ${flexbox()}
      position: absolute;
      opacity: 0;
      text-transform: capitalize;
    }

    .iconButton {
      opacity: 1;
      color: var(--white) !important;
    }
  }

  ${media(
    'maxLaptop',
    css`
      display: none;
    `
  )}

  ${media(
    'minDesktop',
    css`
      li {
        margin-left: 12px;

        > a,
        > button {
          width: auto;
          height: auto;
          padding: 8px 12px;
        }

        .textButton {
          position: static;
          opacity: 1;
        }

        .iconButton {
          position: absolute;
          opacity: 0;
        }
      }
    `
  )}
`

export const StyledGnbMyAsset = styled(Link)`
  ${flexbox()}
  ${textStyle('body', 3)}
  margin-left: 8px;
  padding: 8px;
  font-weight: 700;
  color: var(--primary-300);

  .icon {
    position: absolute;
    opacity: 0;
    margin-left: 8px;
    transition: 200ms;
    visibility: hidden;
  }

  ${media(
    'minDesktop',
    css`
      .icon {
        position: static;
        opacity: 1;
        visibility: visible;
      }
    `
  )}
`
