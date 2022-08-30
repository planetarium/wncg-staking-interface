import { useMount } from 'react-use'
import styles from './style.module.scss'

import { useAllowances } from 'hooks'

import JoinActions from './Actions'
import JoinPreviewComposition from './Composition'
import JoinPreviewSummary from './Summary'

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
  const { fetchAllowances } = useAllowances()

  useMount(fetchAllowances)

  return (
    <div className={styles.joinPreviewModal}>
      <h1 className={styles.title}>Join Pool Preview</h1>
      <JoinPreviewComposition
        amounts={amounts}
        isNativeAsset={isNativeAsset}
        totalUsdValue={totalUsdValue}
      />
      <JoinPreviewSummary
        priceImpact={priceImpact}
        totalUsdValue={totalUsdValue}
      />
      <JoinActions
        amounts={amounts}
        disabled={disabled}
        isNativeAsset={isNativeAsset}
      />
      {/* <JoinEffects /> */}
    </div>
  )
}
