import type { ReactNode } from 'react'
import styled from 'styled-components'

export const StyledPaper = styled.div`
  flex-shrink: 0;
  display: inline-block;
  padding: 0;
  margin: 0;
  overflow: hidden;
  border-radius: 50%;
`

type PaperProps = {
  children: ReactNode
  color: string
  diameter: number
  className?: string
}

function Paper({ children, color, diameter, className }: PaperProps) {
  const style = {
    width: diameter,
    height: diameter,
    backgroundColor: color,
  }

  return (
    <StyledPaper className={className} style={style}>
      {children}
    </StyledPaper>
  )
}

export default Paper
