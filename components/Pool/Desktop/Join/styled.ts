import { motion } from 'framer-motion'
import styled from 'styled-components'

import { flexbox, textStyle } from 'styles/utils'

export const StyledPoolJoin = styled.section``

export const StyledJoinConnect = styled(motion.section)`
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
