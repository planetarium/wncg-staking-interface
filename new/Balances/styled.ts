import styled from 'styled-components'

import {
  flexbox,
  gradient,
  inlineFlexbox,
  posCenterX,
  posCenterY,
  textStyle,
} from 'newStyles/utils'

const StyledBalanceSection = styled.section`
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

export const StyledAvailableBalance = styled(StyledBalanceSection)`
  .content {
    margin: 16px 0;
    overflow: initial;
  }

  .subHeader {
    ${flexbox('space-between')}
    position: relative;
    z-index: 1;
  }

  .tooltip {
    ${inlineFlexbox()}
    position: relative;

    .tooltipToggle {
      ${inlineFlexbox()}
      position: relative;
      flex-shrink: 0;
      width: 16px;
      height: 16px;
      margin-left: 4px;
      color: var(--gray-400);
      opacity: 0.8;

      &:hover {
        & + .tooltipMessage {
          opacity: 1;
          visibility: visible;
          transform: translate3d(-50%, 0, 0);
        }
      }
    }

    .tooltipMessage {
      ${posCenterX()}
      ${textStyle('caption')}
      bottom: calc(100% + 8px);
      padding: 12px 16px;
      font-weight: 700;
      color: var(--gray-700);
      background-color: var(--white);
      border-radius: 6px;
      box-shadow: 0px 16px 64px rgba(25, 25, 27, 0.64);
      opacity: 0;
      visibility: hidden;
      transform: translate3d(-50%, 2px, 0);
      transition: 300ms;
      pointer-events: none;
    }
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
    background-color: var(--white);
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

export const StyledStakedBalance = StyledBalanceSection
