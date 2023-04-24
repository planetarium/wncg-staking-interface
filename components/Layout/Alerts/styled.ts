import styled, { css } from 'styled-components'
import { motion } from 'framer-motion'

import { ALERT_HEIGHT } from 'styles/constants/dimensions'
import { flexbox, textStyle } from 'styles/utils'

import { buttonStyle } from 'components/Button/styled'

type StyledAlertsProps = {
  $enabled?: boolean
}

export const StyledAlerts = styled(motion.aside)<StyledAlertsProps>`
  ${flexbox()}
  flex-shrink: 0;
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
  max-height: 0;
  background-color: var(--error-400);
  cursor: pointer;
  will-change: max-height;
  transition: max-height 300ms;

  ${({ $enabled }) =>
    $enabled &&
    css`
      max-height: ${ALERT_HEIGHT}px;
    `}
`

export const StyledAlertContent = styled(motion.div)`
  ${flexbox()}
  height: ${ALERT_HEIGHT}px;

  .desc,
  .switchButton {
    margin-left: 12px;
  }

  .desc {
    ${textStyle('body', 2)}
    font-weight: 700;
  }

  .switchButton {
    ${buttonStyle}
    ${textStyle('caption')}
    height: 32px;
    padding: 0 16px;
    font-weight: 700;
    color: var(--orange-500);
    background-color: var(--white);
    border-radius: 50px;
  }
`
