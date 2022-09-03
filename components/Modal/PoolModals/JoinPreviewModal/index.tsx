import { useMount } from 'react-use'
import styles from '../style.module.scss'

import { useAllowances } from 'hooks'

import PreviewComposition from '../Composition'
import PreviewSummary from '../Summary'
import JoinActions from './Actions'

type JoinPreviewModalProps = {
  amounts: string[]
  isNativeAsset: boolean
  priceImpact: number
  rektPriceImpact: boolean
  totalFiatValue: string
}

export function JoinPreviewModal({
  amounts,
  isNativeAsset,
  priceImpact,
  rektPriceImpact,
  totalFiatValue,
}: JoinPreviewModalProps) {
  const { fetchAllowances } = useAllowances()

  useMount(fetchAllowances)

  return (
    <div className={styles.previewModal}>
      <h1 className={styles.title}>Join Pool Preview</h1>

      <PreviewComposition
        amounts={amounts}
        isNativeAsset={isNativeAsset}
        totalFiatValue={totalFiatValue}
      />
      <PreviewSummary
        priceImpact={priceImpact}
        totalFiatValue={totalFiatValue}
      />
      <JoinActions
        amounts={amounts}
        rektPriceImpact={rektPriceImpact}
        isNativeAsset={isNativeAsset}
      />
    </div>
  )
}
