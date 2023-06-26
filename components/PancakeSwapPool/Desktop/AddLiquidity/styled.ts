import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { flexbox, media, textStyle } from 'styles/utils'

export const StyledPancakeSwapAddLiquidity = styled.section`
  padding: 32px;
  border-radius: 12px;
  background-color: rgba(var(--white-rgb), 0.05);

  ${media(
    'minTablet',
    css`
      margin-top: 24px;
    `
  )}
`

export const StyledPancakeSwapAddLiquidityConnect = styled(motion.section)`
  ${flexbox()}
  flex-direction: column;
  min-height: 480px;
  padding: 170px 32px;
  background-color: rgba(var(--white-rgb), 0.05);
  border-radius: 12px;

  .title {
    ${textStyle('header', 6)}
    margin-bottom: 32px;
    text-align: center;
  }

  .connectButton {
    max-width: 320px;
  }
`
