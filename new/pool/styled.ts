import styled, { css } from 'styled-components'

type StyledWncgPoolProps = {
  $isModal: boolean
}

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

const pageStyle = css`
  background-color: var(--error-500);
`

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
    background-color: var(--orange-500);
  }

  .sidebar {
    grid-area: 'sidebar';
    background-color: var(--green-500);
  }
`
