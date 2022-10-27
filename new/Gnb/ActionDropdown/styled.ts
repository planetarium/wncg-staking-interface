import { motion } from 'framer-motion'
import styled from 'styled-components'

import { textStyle } from 'newStyles/utils'

import { buttonStyle } from 'new/Button/styled'

export const StyledActionDropdown = styled(motion.div)`
  position: relative;
  z-index: 1;
`

export const StyledActionDropdownToggle = styled.button`
  ${buttonStyle}
  ${textStyle('body', 3)}
  position: relative;
  padding: 12px 20px;
  color: var(--white);
  background-color: rgba(var(--white-rgb), 0.05);
  border-radius: 40px;

  .icon,
  .amount {
    flex-shrink: 0;
  }

  .label {
    margin: 0 4px;

    &::after {
      margin-left: 2px;
      content: ':';
    }
  }
`
