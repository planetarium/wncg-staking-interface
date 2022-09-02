import { useMount } from 'react-use'
import styles from './style.module.scss'

import { useAllowances } from 'hooks'

type ExitPreviewModalProps = {
  amounts: string[]
  disabled: boolean
  priceImpact: number
  totalFiatValue: string
}

export function ExitPreviewModal({
  amounts,
  disabled,
  priceImpact,
  totalFiatValue,
}: ExitPreviewModalProps) {
  return (
    <div className={styles.joinPreviewModal}>
      <h1 className={styles.title}>Exit Pool Preview</h1>
    </div>
  )
}
