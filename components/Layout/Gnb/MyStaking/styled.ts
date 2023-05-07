import styled from 'styled-components'
import { motion } from 'framer-motion'

import { GNB_DROPDOWN_MENU_WIDTH } from 'styles/constants/dimensions'
import { flexbox, posCenter, textStyle } from 'styles/utils'

import { buttonStyle } from 'components/Button/styled'

const UNSTAKE_BADGE_SIZE = 16
const UNSTAKE_BADGE_BORDER_WIDTH = 4

export const StyledGnbMyStaking = styled.div`
  position: relative;
  margin-left: 16px;

  .stakingButton {
    ${buttonStyle}
    ${textStyle('body', 3)}
    height: 48px;
    padding: 0 16px 0 12px;
    overflow: visible;
    color: var(--white);
    border-radius: 40px;
    background-color: #281e4a;

    .icon {
      margin-right: 4px;
    }

    .countUp {
      ${textStyle('body', 2)}
      font-weight: 700;
    }
  }

  .cooldownBadge {
    ${flexbox()}
    position: relative;
    width: 32px;
    height: 32px;
    margin-left: 10px;
    transition: 300ms;
    background-color: var(--primary-500);
    border-radius: 50%;

    .lottie {
      ${posCenter()}
      width: 32px;
      height: 32px;
    }
  }

  .unstakeBadge {
    position: absolute;
    top: 0;
    right: -${UNSTAKE_BADGE_BORDER_WIDTH}px;
    width: ${UNSTAKE_BADGE_SIZE}px;
    height: ${UNSTAKE_BADGE_SIZE}px;
    box-shadow: 0 0 0 ${UNSTAKE_BADGE_BORDER_WIDTH}px #281e4a;
    border-radius: 50%;
    background-color: var(--primary-500);
  }
`

export const StyledMyStakingWallet = styled(motion.aside)`
  position: absolute;
  top: calc(100% + 16px);
  left: -16px;
  width: ${GNB_DROPDOWN_MENU_WIDTH}px;
  padding: 24px;
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.48);
`

const StyledMyStakingWalletSection = styled.section`
  .header {
  }

  .title {
    ${textStyle('body', 2)}
    font-weight: 700;
    color: var(--gray-500);
  }

  .content {
    margin-top: 16px;
  }
`

export const StyledMyStakingStaking = styled(StyledMyStakingWalletSection)``
