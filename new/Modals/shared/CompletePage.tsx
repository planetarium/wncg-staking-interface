import type { ReactNode } from 'react'

import { StyledModalCompletePage } from './styled'
import Button from 'new/Button'
import SvgIcon, { SvgIconType } from 'new/SvgIcon'

type CompletePageProps = {
  buttonLabel: string
  onClick(): void
  title: string
  children?: ReactNode
  icon?: SvgIconType
}

function CompletePage({
  buttonLabel,
  onClick,
  title,
  children,
  icon,
}: CompletePageProps) {
  return (
    <StyledModalCompletePage>
      {icon && <SvgIcon icon={icon} />}

      <header className="header">
        <h2 className="title">{title}</h2>
      </header>

      {children && <div className="content">{children}</div>}

      <Button onClick={onClick} $size="lg">
        {buttonLabel}
      </Button>
    </StyledModalCompletePage>
  )
}

export default CompletePage
