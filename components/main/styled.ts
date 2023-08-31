import { lgButtonStyle, mdButtonStyle } from 'components/Button/styled'
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
      ${textStyle('body', 4, 700)}
      flex-direction: column;

      .logoIcon {
        margin-bottom: 8px;
      }

      .cryptoIcon {
        margin-right: 8px;
      }
    }

    .subtitle {
      ${textStyle('header', 6)}
      margin-top: 16px;
    }

    .linkGroup {
      display: none;
    }
  }

  .mobileImage {
    display: block;
    width: 280px;
    height: 280px;
    margin: 16px auto 0;

    img {
      transform: scale(1.2);
    }
  }

  .tabletImage {
    display: none;
    width: 100%;
    height: auto;
  }

  .group {
    margin-top: 16px;
  }

  .desc {
    ${textStyle('caption')}
    color: var(--gray-400);
  }

  .rewardItem {
    ${flexbox()}
    ${textStyle('caption')}
    color: var(--gray-400);
    margin-top: 4px;
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

      .cryptoIcon {
        margin-right: 4px;
      }

      strong {
        font-weight: 500;
      }
    }
  }

  .content {
    margin-top: 64px;
  }

  .linkList {
    ${flexbox()}
  }

  .linkItem {
    flex-shrink: 0;
    margin-left: 12px;

    &:first-child {
      width: 200px;
      margin-left: 0;
    }

    &:not(:first-child) {
      width: 48px;
      height: 48px;
    }

    button,
    a {
      ${mdButtonStyle}

      .icon {
        width: 24px;
        height: 24px;
        margin: 0;
      }
    }
  }

  ${media(
    'minTablet',
    css`
      .header {
        .title {
          ${textStyle('body', 3, 700)}
          flex-direction: row;

          .logoIcon {
            margin-right: 8px;
            margin-bottom: 0;
          }
        }

        .subtitle {
          ${textStyle('header', 5)}
          margin-top: 40px;
        }
      }

      .mobileImage {
        display: none;
      }

      .tabletImage {
        display: flex;
      }

      .group {
        margin-top: 20px;
      }

      .rewardList {
        ${flexbox()}
      }

      .desc {
        ${textStyle('body', 4)}
      }

      .rewardItem {
        ${textStyle('body', 4)}
        margin-top: 0;
        margin-left: 16px;
      }

      .content {
        margin-top: 80px;
      }

      .linkItem {
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
          ${lgButtonStyle}

          .icon {
            width: 36px;
            height: 36px;
          }
        }
      }
    `
  )}

  ${media(
    'minLaptop',
    css`
      .header {
        .subtitle {
          ${textStyle('header', 4)}
          margin-top: 20px;
        }

        .linkGroup {
          ${flexbox()}
          margin-top: 40px;
        }

        .chainButton {
          ${flexbox()}
          ${textStyle('body', 4)}
          padding: 8px 12px;
          margin-left: 12px;
          color: var(--gray-25);
          background-color: var(--gray-900);
          border-radius: 50px;

          &:first-child {
            margin-left: 0;
          }

          .cryptoIcon {
            margin-right: 8px;
          }
        }
      }

      .tabletImage {
        width: 880px;
        height: 880px;
      }

      .group {
        margin-top: 40px;

        .rewardList {
          margin-top: 8px;
        }
      }
    `
  )}
`
