import { useRecoilValue } from 'recoil'
import styles from './style.module.scss'

import { poolTokenApprovalsState } from 'app/states/approval'

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
  const poolTokenApproval = useRecoilValue(poolTokenApprovalState)

  return <div className={styles.investPreviewModal}>InvestPreview</div>
}
