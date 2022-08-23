import styles from './style.module.scss'

import InvestActions from './Actions'
import InvestComposition from './Composition'
import InvestSummary from './Summary'

type InvestPreviewModalProps = {
  amounts: string[]
  isNativeAsset: boolean
  priceImpact: number
  totalUsdValue: string
}

export function InvestPreviewModal({
  amounts,
  isNativeAsset,
  priceImpact,
  totalUsdValue,
}: InvestPreviewModalProps) {
  return (
    <div className={styles.investPreviewModal}>
      <h1 className={styles.title}>Join Pool Preview</h1>
      <InvestComposition
        amounts={amounts}
        isNativeAsset={isNativeAsset}
        totalUsdValue={totalUsdValue}
      />
      <InvestSummary priceImpact={priceImpact} totalUsdValue={totalUsdValue} />
      <InvestActions amounts={amounts} isNativeAsset={isNativeAsset} />
    </div>
  )
}
