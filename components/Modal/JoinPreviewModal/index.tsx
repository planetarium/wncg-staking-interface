import styles from './style.module.scss'

import JoinActions from './Actions'
import JoinComposition from './Composition'
import JoinSummary from './Summary'

type JoinPreviewModalProps = {
  amounts: string[]
  disabled: boolean
  isNativeAsset: boolean
  priceImpact: number
  totalUsdValue: string
}

export function JoinPreviewModal({
  amounts,
  disabled,
  isNativeAsset,
  priceImpact,
  totalUsdValue,
}: JoinPreviewModalProps) {
  return (
    <div className={styles.joinPreviewModal}>
      <h1 className={styles.title}>Join Pool Preview</h1>
      <JoinComposition
        amounts={amounts}
        isNativeAsset={isNativeAsset}
        totalUsdValue={totalUsdValue}
      />
      <JoinSummary priceImpact={priceImpact} totalUsdValue={totalUsdValue} />
      <JoinActions
        amounts={amounts}
        disabled={disabled}
        isNativeAsset={isNativeAsset}
      />
    </div>
  )
}
