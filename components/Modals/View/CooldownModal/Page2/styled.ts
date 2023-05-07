import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { flexbox, gradient, media, posCenterY, textStyle } from 'styles/utils'
import { ModalPage } from 'components/Modals/shared'

export const StyledCooldownModalPage1 = styled(ModalPage)``

const GUIDE_ITEM_ICON_SIZE = 40
const GUIDE_ITEM_PADDING = 16

export const StyledCooldownModalPage2 = styled(ModalPage)`
  .modalContent {
    margin-bottom: -${GUIDE_ITEM_PADDING}px;
  }

  .modalFooter {
    button {
      margin-top: 0;
    }
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      .modalContent,
      .modalFooter {
        opacity: 0.5;
      }
    `}
`

export const StyledCooldownModalPage2BarGraph = styled(motion.div)`
  ${flexbox('start')}
  width: 100%;
  overflow: hidden;
  background-color: rgba(var(--white-rgb), 0.1);
  border-radius: 100px;

  .bar {
    ${flexbox('start')}
    ${textStyle('caption')}
    flex-grow: 1;
    flex-shrink: 0;
    height: 24px;
    font-weight: 700;
    white-space: nowrap;
    transition: 400ms;

    &.cooldown {
      color: rgba(var(--white-rgb), 0.9);

      dt {
        margin-left: 16px;
      }
    }

    &.unstake {
      color: var(--white);
      justify-content: flex-end;
      background-image: ${gradient(2)};

      dd {
        margin-right: 16px;
      }
    }

    dt {
      position: relative;

      &::after {
        content: ':';
        margin: 0 0.2em;
        font-weight: 700;
      }
    }

    dd {
      position: relative;

      .number {
        font-weight: 700;
      }
    }
  }

  ${media(
    'minSmLaptop',
    css`
      .bar {
        ${flexbox('start')}
        ${textStyle('body', 4, 700)}
        height: 32px;
      }
    `
  )}
`

export const StyledCooldownModalPage2Guide = styled.dl`
  margin-top: ${40 - GUIDE_ITEM_PADDING}px;

  .guideItem {
    position: relative;
    padding: ${GUIDE_ITEM_PADDING}px 0 ${GUIDE_ITEM_PADDING}px
      ${GUIDE_ITEM_ICON_SIZE + 16}px;

    .iconContainer {
      ${posCenterY()}
      ${flexbox()}
      left: 0;
      width: ${GUIDE_ITEM_ICON_SIZE}px;
      height: ${GUIDE_ITEM_ICON_SIZE}px;
      margin-top: 0;
      color: var(--white);
      background-color: var(--primary-500);
      border-radius: ${GUIDE_ITEM_ICON_SIZE}px;
    }

    dt {
      ${textStyle('body', 3, 700)}
      color: var(--white);
    }

    dd {
      ${textStyle('body', 4)}
      margin-top: 4px;
      color: var(--gray-500);
    }
  }

  ${media(
    'minSmLaptop',
    css`
      .guideItem {
        dt {
          ${textStyle('subtitle', 2)}
          color: var(--white);
        }

        dd {
          ${textStyle('body', 3)}
          margin-top: 4px;
          color: var(--gray-500);
        }
      }
    `
  )}
`

export const StyledCooldownModalPage2Summary = styled.div`
  padding: ${24 - 16}px 0 20px;
  text-align: center;

  .desc {
    ${textStyle('body', 3)}
    color: var(--gray-500);
  }

  .period {
    ${textStyle('body', 2, 700)}
    margin-top: 8px;
    color: var(--white);
    white-space: nowrap;
  }
`
