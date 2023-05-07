import { mdInputStyle, smInputStyle } from 'components/Form/styled'
import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { flexbox, media, textStyle } from 'styles/utils'

const INPUT_FIELD_GAP = 24

export const StyledJoinFormFieldset = styled(motion.fieldset)`
  width: 100%;
  padding: 0;
  margin-top: 32px;
  border: 0;

  .joinInputField {
    width: 100%;
    margin-top: 24px;

    &:first-child {
      margin-top: 0;
    }
  }

  ${media(
    'minTablet',
    css`
      ${flexbox('between', 'start')}

      .joinInputField {
        width: calc(50% - ${24 / 2}px);
        margin-top: 0;
        margin-left: 16px;

        &:first-child {
          margin-left: 0;
        }
      }
    `
  )}
`

export const StyledJoinFormJoinFormEtherSelect = styled.div`
  .dropdownToggle {
    .icon {
      margin-left: 4px;
    }
  }

  .menuItem {
    &.selected {
      color: var(--gray-900);

      .label {
        font-weight: 700 !important;
      }
    }

    .label {
      color: var(--gray-400);
      font-weight: 500 !important;
    }
  }

  ${media(
    'minLaptop',
    css`
      .dropdownToggle {
        ${textStyle('body', 2, 700)}
      }
    `
  )}
`

export const StyledJoinFormInputField = styled(motion.div)<{
  $disabled: boolean
}>`
  width: calc(50% - ${INPUT_FIELD_GAP / 2}px);

  .labelGroup {
    ${flexbox('between')}
    margin-bottom: 8px;
    white-space: nowrap;

    > .label {
      ${textStyle('body', 3, 700)}
      color: var(--white);
    }

    .weight {
      ${textStyle('body', 3)}
      color: rgba(var(--white-rgb), 0.9);
    }
  }

  .baseInput {
    ${smInputStyle}

    .input {
      ${textStyle('body', 3, 700)}
      padding-right: ${54 + 8 * 2}px;
    }

    .maxButton {
      ${textStyle('body', 3)}
      right: 8px;
      width: 54px;
      height: 36px;
    }
  }

  .availableTokenAmount {
    dd {
      flex-wrap: wrap;

      .number {
        margin-right: 4px;
      }

      .parenthesis {
        margin-left: 0;
      }
    }
  }

  ${media(
    'minLaptop',
    css`
      .labelGroup {
        .label {
          ${textStyle('body', 2, 700)}
        }
      }
    `
  )}

  ${media(
    'minLaptop',
    css`
      .baseInput {
        ${mdInputStyle}

        .input {
          ${textStyle('body', 1, 700)}
          padding-right: ${80 + 16 + 8}px;
        }

        .maxButton {
          right: 8px;
          width: 80px;
        }

        .maxButton {
          ${textStyle('body', 1)}
          right: 12px;
          width: 80px;
          height: 48px;
        }
      }
    `
  )}

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
    `}
`

export const StyledJoinFormWarning = styled(motion.div)`
  ${flexbox()}
  ${textStyle('body', 4)}
  padding: 12px 16px;
  margin-top: 8px;
  background-color: var(--primary-800);
  border-radius: 4px;

  .icon {
    margin-right: 12px;
  }

  .desc {
    color: rgba(var(--white-rgb), 0.9);
  }

  ${media(
    'minTablet',
    css`
      margin-top: 12px;
    `
  )}
`
