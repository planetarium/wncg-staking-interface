import styled, { css } from 'styled-components'

import { ModalPage } from 'components/Modals/shared'
import { flexbox, textStyle } from 'newStyles/utils'

export const StyledClaimRewardModalPage1 = styled(ModalPage)`
  .checkout {
    ${flexbox('space-between')}
    width: 100%;
    margin-top: 64px;
    margin-bottom: 24px;

    .text,
    .value {
      width: calc(50% - 4px);
    }

    .text {
      ${textStyle('body', 3)}
      text-align: right;
    }

    .value {
      ${flexbox('flex-start')}
      ${textStyle('title')}
      transition: 150ms;

      &.enabled {
        color: var(--primary-300);
      }
    }
  }
`

export const ClaimRewardModalPage1SelectRewards = styled.div<{
  $disabled: boolean
}>`
  ${flexbox('space-between')}

  .rewardItem {
    position: relative;
    display: block;
    width: calc(50% - 8px);
    padding: 24px;
    border: 1px solid var(--gray-400);
    border-radius: 8px;
    background-color: rgba(var(--white-rgb), 0.05);
    transition: 100ms;

    &:has(input:checked) {
      border-color: var(--primary-400);

      .checkIcon {
        opacity: 1;
        transform: scale(1);
      }
    }
  }

  .rewardToken {
    ${flexbox('flex-start')}

    .tokenIcon {
      flex-shrink: 0;
      margin-right: 8px;
    }

    strong {
      ${textStyle('subtitle', 1)}
      color: var(--white);
    }
  }

  .amount {
    ${textStyle('body', 2)}
    margin-top: 8px;
  }

  .fiatValue {
    ${flexbox('flex-end')}
    ${textStyle('title')}
    margin-top: 24px;
    color: var(--white);
    white-space: nowrap;

    .icon {
      flex-shrink: 0;
      margin-right: 2px;
    }
  }

  .input {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
    visibility: hidden;
    appearance: none;
  }

  .checkIcon {
    position: absolute;
    top: 24px;
    right: 24px;
    color: var(--primary-400);
    opacity: 0;
    transform: scale(0.75);
    transition: 100ms;
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
    `}
`
