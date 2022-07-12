import type { ReactNode } from 'react'
import clsx from 'clsx'
import styles from './style.module.scss'

type PaperProps = {
  children: ReactNode
  color: string
  diameter: number
  className?: string
}

export function Paper({ children, color, diameter, className }: PaperProps) {
  const style = {
    width: diameter,
    height: diameter,
    backgroundColor: color,
  }

  return (
    <div className={clsx(styles.paper, className)} style={style}>
      {children}
    </div>
  )
}
