import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'
import { flexbox, media, textStyle } from 'styles/utils'

export const StyledMainCard = styled(motion.div)`
  max-width: 880px;
  margin: 0 auto;

  .header {
    text-align: center;

    .title {
      ${flexbox()}
      ${textStyle('body', 3, 700)}

      .tokenIcon {
        margin-right: 8px;
      }
    }

    .subtitle {
      ${textStyle('header', 4)}
      margin-top: 40px;
    }
  }

  .rewardList {
    ${flexbox()}
    margin-top: 20px;
  }

  .rewardItem {
    ${flexbox()}
    ${textStyle('body', 4)}
    color: var(--gray-400);
    margin-left: 16px;
    white-space: nowrap;

    &:first-child {
      margin-left: 0;
    }

    dt {
      ${flexbox()}

      &::after {
        margin: 0 0.25em;
        content: ':';
      }

      .tokenIcon {
        margin-right: 4px;
      }

      strong {
        font-weight: 500;
      }
    }
  }

  .linkList {
    ${flexbox()}
    margin-top: 80px;
  }

  .linkItem {
    flex-shrink: 0;
    margin-left: 12px;

    &:first-child {
      width: 240px;
      margin-left: 0;
    }

    &:not(:first-child) {
      width: 72px;
      height: 72px;
    }

    button,
    a {
      .icon {
        margin: 0;
      }
    }
  }

  ${media(
    'minLaptop',
    css`
      .header {
        .title {
          ${textStyle('body', 3, 700)}

          .tokenIcon {
            margin-right: 8px;
          }
        }

        .subtitle {
          ${textStyle('header', 4)}
        }
      }

      .rewardList {
        ${flexbox()}
      }

      .rewardItem {
        ${flexbox()}
        ${textStyle('body', 4)}
        margin-left: 16px;

        &:first-child {
          margin-left: 0;
        }

        dt {
          ${flexbox()}

          .tokenIcon {
            margin-right: 4px;
          }
        }
      }

      .linkList {
        margin-top: 80px;
      }
    `
  )}
`
