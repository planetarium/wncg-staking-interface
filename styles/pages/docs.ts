import styled, { css } from 'styled-components'
import { media, noScrollbar, textStyle } from 'styles/utils'

export const StyledDocsPage = styled.div`
  ${noScrollbar()}
  ${textStyle('body', 3)};
  min-height: calc(100vh - 56px);
  padding: 40px 0;
  overflow-x: hidden;
  color: $gray-6;
  background-color: $white;

  ${media(
    'minTablet',
    css`
      padding: 80px 0;
    `
  )}

  .container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 800px !important;
    margin: 0 auto;
  }

  .header {
    padding: 30px 0;
    margin-bottom: 30px;
    text-align: center;

    .title {
      font-size: 36px;
      line-height: 1;
      margin-bottom: 10px;
      color: var(--white);
    }

    .updated {
      ${textStyle('body', 4)}
      color: var(--white);
    }
  }

  .section {
    margin-top: 3rem;

    &:last-of-type {
      margin-bottom: 3rem;
    }

    h2 {
      ${textStyle('header', 2)};
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
      font-size: 20px;
      color: var(--white);
    }

    h3 {
      ${textStyle('body', 1, 700)};
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      color: var(--white);
    }

    p {
      margin-bottom: 1rem;
    }

    a {
      color: var(--primary-300);
      transition: 200ms;

      &:hover {
        opacity: 0.5;
      }
    }

    strong {
      font-weight: 400;
    }

    ul {
      list-style-type: disc;
      padding-left: 20px;

      ul {
        list-style-type: circle;
        padding-top: 8px;
        padding-bottom: 8px;
      }

      > li {
        padding: 4px 0;

        ul:last-child {
          margin-bottom: -8px;
        }
      }

      h4 {
        margin-bottom: 0.5rem;
      }

      & + * {
        margin-top: 1.5rem;
      }

      p.bold {
        margin-bottom: 0;
      }
    }

    table {
      ${textStyle('body', 3)};
      text-align: left;
      border-collapse: collapse;

      thead {
        tr {
          border-bottom: 1px solid var(--gray-800);
        }

        th {
          padding: 4px 8px 4px 0;
        }
      }

      tbody {
        tr {
          &:last-child {
            border-bottom: 1px solid var(--gray-800);
          }
        }

        th,
        td {
          padding: 10px 8px 16px 0;
          vertical-align: top;
        }
      }

      h6 {
        font-size: 1em;
      }

      & + * {
        margin-top: 1rem;
      }
    }
  }

  .underline {
    font-style: normal;
    text-decoration: underline;
  }

  .bold {
    font-weight: 700 !important;
  }
`
