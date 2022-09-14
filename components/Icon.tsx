type Icon =
  | 'alert'
  | 'approximate'
  | 'arrowRightUp'
  | 'arrowRight'
  | 'beta'
  | 'bin'
  | 'caret'
  | 'check'
  | 'checkCircle'
  | 'chevronLeft'
  | 'chevronRight'
  | 'clipboard'
  | 'clock'
  | 'close'
  | 'closeCircle'
  | 'coin'
  | 'diamond'
  | 'discord'
  | 'externalLink'
  | 'github'
  | 'info'
  | 'lock'
  | 'medium'
  | 'pulse'
  | 'question'
  | 'settings'
  | 'telegram'
  | 'twitter'
  | 'balancer'
  | 'ethereum'
  | 'ethereumSimple'
  | 'metamask'

type IconProps = {
  id: Icon
  ariaLabel?: string
  ariaHidden?: boolean
  className?: string
}

export function Icon({ id, ariaLabel, ariaHidden, className }: IconProps) {
  return (
    <svg className={className} aria-label={ariaLabel} aria-hidden={ariaHidden}>
      <use href={`/sprites.svg#${id}`} />
    </svg>
  )
}
