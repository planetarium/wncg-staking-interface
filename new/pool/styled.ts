import { flexbox, gradient, inlineFlexbox, textStyle } from 'newStyles/utils'
import styled, { css } from 'styled-components'

const modalStyle = css`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: calc(100vh - 32px);
  overflow: hidden;
  background-color: rgba(18, 18, 18, 0.6);
  backdrop-filter: blur(40px);
  border-radius: 32px 32px 0 0;
`

const pageStyle = css``

type StyledWncgPoolProps = {
  $isModal: boolean
}

export const StyledWncgPool = styled.div<StyledWncgPoolProps>`
  ${({ $isModal }) => ($isModal ? modalStyle : pageStyle)}

  .container {
    display: grid;
    grid-gap: 20px;
    grid-template-areas: 'content' 'sidebar';
    grid-template-columns: 880px 400px;
    grid-column-gap: 48px;
    width: 100%;
    padding-top: 80px;
    padding-bottom: 158px;
    max-width: ${880 + 400 + 48}px;
    margin: 0 auto;
  }

  .content {
    grid-area: 'content';
  }

  .sidebar {
    grid-area: 'sidebar';
    background-color: var(--green-500);
  }

  .poolInformation {
    margin-top: 48px;
  }
`

export const StyledPoolHeader = styled.header`
  .poolName {
    ${textStyle('body', 3)}
    display: inline-block;
    margin-bottom: 12px;
    font-weight: 700;
    background-image: ${gradient(4)};
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    opacity: 0.9;
  }

  .titleGroup {
    ${flexbox('space-between', 'flex-end')}
  }

  .title {
    ${textStyle('header', 4)}
  }

  .tokenList {
    ${flexbox('flex-start')}
    padding-bottom: 8px;
  }

  .tokenItem {
    ${flexbox('flex-start')}
    ${textStyle('body', 3)}
    margin-left: 12px;
    color: var(--gray-400);
    white-space: nowrap;

    &:first-child {
      margin-left: 0;
    }

    .tokenIcon {
      margin-right: 4px;
    }

    .symbol {
      margin-right: 4px;
      font-weight: 700;
    }

    .extLink {
      ${inlineFlexbox()}
      width: 16px;
      height: 16px;
    }
  }
`
