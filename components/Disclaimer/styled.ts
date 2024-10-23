import styled from 'styled-components'

export const StyledDisclaimer = styled.p`
  color: white;
  font-size: 14px;
  line-height: 18px;
  font-weight: 700;
  a {
    text-decoration: underline;
    &:hover {
      color: var(--rk-colors-modalTextSecondary);
    }
  }
`
