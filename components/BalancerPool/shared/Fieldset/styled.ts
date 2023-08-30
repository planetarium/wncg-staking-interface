import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { flexbox, media, textStyle } from 'styles/utils'
import { mdInputStyle, smInputStyle } from 'components/Form/styled'

const INPUT_FIELD_GAP = 24

export const StyledJoinFormFieldset = styled(motion.fieldset)<{
  $reverse: boolean
}>`
  width: 100%;
  padding: 0;
  margin-top: 24px;
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
      margin-top: 32px;

      .joinInputField {
        width: calc(50% - ${24 / 2}px);
        margin-top: 0 !important;
        margin-left: 16px;

        &:first-child {
          margin-left: 0;
        }
      }
    `
  )}

  ${({ $reverse }) =>
    $reverse &&
    css`
      ${flexbox('start', 'start')}
      flex-direction: column-reverse;

      .joinInputField {
        &:last-child {
          margin-top: 0;
        }
      }

      ${media(
        'minTablet',
        css`
          ${flexbox('between', 'start')}
          flex-direction: row-reverse;

          .joinInputField {
            margin-left: 16px;

            &:last-child {
              margin-left: 0;
            }
          }
        `
      )}
    `}

  ${({ $reverse }) =>
    !$reverse &&
    css`
      .joinInputField {
        &:first-child {
          margin-top: 0;
        }
      }

      ${media(
        'minTablet',
        css`
          &:first-child {
            margin-top: 0;
          }
        `
      )}
    `}
`

export const StyledJoinFormEtherSelect = styled.div`
  .dropdownToggle {
    ${textStyle('body', 4, 700)}

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
      color: var(--gray-500);
      font-weight: 500 !important;
    }
  }

  ${media(
    'minSmLaptop',
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
    margin-bottom: 4px;
    white-space: nowrap;

    > .label {
      ${textStyle('body', 4, 700)}
      color: var(--white);
    }

    .weight {
      ${textStyle('body', 4)}
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
    margin-top: 4px;

    dd {
      flex-wrap: wrap;

      .number {
        margin-right: 4px;
      }

      .parenthesis {
        margin-left: 0;

        .number {
          margin-right: 0px;
        }
      }
    }
  }

  ${media(
    'minSmLaptop',
    css`
      .labelGroup {
        margin-bottom: 8px;

        .label {
          ${textStyle('body', 2, 700)}
        }

        .weight {
          ${textStyle('body', 3)}
        }
      }

      .availableTokenAmount {
        margin-top: 8px;
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

export const StyledJoinFormNotice = styled(motion.aside)<{
  $suggestion?: boolean
}>`
  ${textStyle('body', 4)}
  padding: 16px;
  margin-top: 8px;
  background-color: var(--primary-50);
  border-radius: 4px;
  transition: 200ms;

  .badge {
    ${flexbox('start')}
    ${textStyle('body', 4, 700)}
    color: var(--primary-500);

    .icon {
      margin-right: ${2 + 4}px;
      margin-left: 2px;
    }

    .lottie {
      width: 16px;
      height: 16px;
      overflow: hidden;

      > div {
        position: relative;
        top: 2px;
        width: 36px !important;
        height: 36px !important;

        svg {
          width: 36px !important;
          height: 36px !important;
        }
      }
    }
  }

  .title {
    ${textStyle('body', 4, 700)}
    padding: 0 2px;
    margin-top: 8px;
    color: var(--gray-700);
  }

  .desc {
    padding: 0 2px;
    margin-top: 2px;
    color: var(--gray-600) !important;
  }

  ${media(
    'minTablet',
    css`
      margin-top: 12px;
    `
  )}

  ${({ $suggestion }) =>
    $suggestion &&
    css`
      background-color: #f2fffe;

      .badge {
        color: var(--green-600);
      }
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
