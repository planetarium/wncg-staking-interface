import styles from './style.module.scss'

import InvestActions from './Actions'
import InvestComposition from './Composition'
import InvestSummary from './Summary'

type InvestPreviewModalProps = {
  amounts: string[]
  currentEthType: EthType
  priceImpact: number
  totalUsdValue: string
}

export function InvestPreviewModal({
  amounts,
  currentEthType,
  priceImpact,
  totalUsdValue,
}: InvestPreviewModalProps) {
  return (
    <div className={styles.investPreviewModal}>
      <h1 className={styles.title}>Investment Preview</h1>
      <InvestComposition
        amounts={amounts}
        currentEthType={currentEthType}
        totalUsdValue={totalUsdValue}
      />
      <InvestSummary priceImpact={priceImpact} totalUsdValue={totalUsdValue} />
      <InvestActions amounts={amounts} currentEthType={currentEthType} />
    </div>
  )
}
