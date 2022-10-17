import { motion } from 'framer-motion'
import { buttonStyle } from 'new/Button/styled'
import { flexbox, textStyle } from 'newStyles/utils'
import styled from 'styled-components'

export const StyledPoolForm = styled(motion.section)`
  padding: 32px;
  /* overflow: hidden; */
  background-color: rgba(var(--white-rgb), 0.05);
  border-radius: 12px;
`

export const StyledPoolFormHeader = styled.header`
  position: relative;

  .title {
    ${flexbox('flex-start')}
    ${textStyle('title')}
    margin-bottom: 8px;

    .tokens {
      ${flexbox('flex-start')}
      flex-shrink: 0;
      margin-right: 8px;

      .tokenIcon {
        &:first-child {
          position: relative;
          margin-left: 0;
        }

        margin-left: -8px;
      }
    }
  }

  .buttonGroup {
    ${flexbox('flex-end')}
    position: absolute;
    top: 0;
    right: 0;

    button {
      flex-shrink: 0;
    }
  }

  .refreshButton {
    ${buttonStyle}
    width: 32px;
    height: 32px;
    margin-left: 12px;
    overflow: hidden;
    border-radius: 50%;
    background-color: rgba(var(--white-rgb), 0.05);
    color: var(--white);
  }

  .slippageDropdown {
    ${flexbox('flex-start')}
    ${textStyle('body', 3)}

    strong {
      font-weight: 500;
      color: rgba(var(--white-rgb), 0.6);

      &::after {
        content: ':';
        margin-right: 4px;
        margin-left: 2px;
      }
    }
  }
`

export const StyledPoolTokenInput = styled.div``
