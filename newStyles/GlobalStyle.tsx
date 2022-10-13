import { createGlobalStyle } from 'styled-components'

import { fontFamily } from './constants/typography'
import { flexbox, generateHexVariables, generateRgbVariables } from './utils'

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    font-family: ${fontFamily.text};
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;

    &::selection {
    }
  }

  :root {
    --white: #ffffff;
    --black: #000000;
    --white-rgb: 255, 255, 255;
    --black-rgb: 0, 0, 0;
    ${generateHexVariables()};
    ${generateRgbVariables()};
  }

  html {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    font-family: ${fontFamily.text};
    transition: 100ms;
  }

  body {
    width: 100%;
    max-width: 100vw;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    font-family: ${fontFamily.text};
    transition: 100ms;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  h1 {
    margin: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button,
  input,
  select,
  textarea {
    font-family: ${fontFamily.text};
    background-color: transparent;
    border: 0;

    &:focus {
      outline: none;
      box-shadow: none;
    }
  }

  a,
  button {
    cursor: pointer;
  }

  button {
    padding: 0;
  }

  input {
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  ul,
  ol {
    padding-left: 0;
    list-style: none;
  }

  address {
    font-style: normal;
  }

  abbr {
    text-decoration: none;
  }

  table {
    border-collapse: collapse;
    border: 0;
  }


  // NOTE: Globally used classNames
  .a11y {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }

  .usd {
    ${flexbox('flex-start')}
  }
`

export default GlobalStyle
