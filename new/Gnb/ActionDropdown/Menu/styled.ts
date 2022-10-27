import { motion } from 'framer-motion'
import styled from 'styled-components'

import { flexbox, gradient, posCenterY, textStyle } from 'newStyles/utils'
import { buttonStyle } from 'new/Button/styled'

export const StyledActionDropdownMenu = styled(motion.aside)`
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  z-index: 1;
  width: 360px;
  padding: 24px;
  background-color: var(--white);
  border-radius: 8px;
`

const StyledActionMenuSection = styled.section`
  &:not(:first-child) {
    padding-top: 32px;
    margin-top: 32px;
    box-shadow: 0 -1px 0 0 var(--gray-200);
  }

  .title {
    ${textStyle('body', 2)}
    margin-bottom: 4px;
    font-weight: 700;
    color: var(--gray-500);
  }

  .detail {
    ${flexbox('flex-start')}
  }

  .detailItem {
    ${textStyle('title')}
    margin-left: 4px;

    &:first-child {
      margin-left: 0;
    }

    dd {
      ${flexbox('flex-start')}
      color: var(--black);
    }
  }

  .fiatValue {
    ${flexbox('flex-start')}

    .icon {
      color: var(--gray-500);
    }

    strong {
      ${textStyle('body', 2)}
      color: var(--gray-500);
    }
  }
`

export const StyledStakedBalance = styled(StyledActionMenuSection)`
  .buttonGroup {
    margin-top: 16px;

    button {
      margin-top: 16px;

      &:first-child {
        margin-top: 0;
      }
    }
  }

  .earnButton {
    ${buttonStyle}
    ${textStyle('body', 3)}
    justify-content: space-between;
    width: 100%;
    height: 48px;
    padding: 0 16px;
    font-weight: 700;
    color: var(--white);
    background-image: ${gradient(1)};
    border-radius: 6px;
  }
`

export const StyledAvailableBalance = styled(StyledActionMenuSection)`
  .content {
    margin: 16px 0;
  }

  .subtitle {
    ${textStyle('body', 4)}
    font-weight: 700;
    background-image: ${gradient(4)};
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .balanceList {
    margin-top: 8px;
  }

  .balanceItem {
    position: relative;
    padding: 16px;
    padding-left: 60px;
    margin-top: 8px;
    border: 1.5px solid var(--gray-200);
    border-radius: 6px;

    &:first-child {
      margin-top: 0;
    }

    dt {
      ${textStyle('body', 3)}

      .symbol {
      }

      .pcnt {
        margin-left: 4px;
        color: var(--gray-400);
      }
    }

    dd {
      ${flexbox('flex-start')}
      color: var(--gray-600);

      .amount {
        ${textStyle('body', 2)}
        font-weight: 700;
      }

      .fiatValue {
        margin-left: 4px;

        strong {
          ${textStyle('body', 2)}
          color: var(--gray-500);
        }
      }
    }
  }

  .tokenIcon {
    ${posCenterY()}
    left: 16px;
  }
`
