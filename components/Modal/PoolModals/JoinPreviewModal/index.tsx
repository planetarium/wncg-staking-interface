import { useMount } from 'react-use'
import styles from '../style.module.scss'

import { ModalCategory } from 'app/states/modal'
import { useAllowances, useModal } from 'hooks'

import { Icon } from 'components/Icon'
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
  const { removeModal } = useModal()

  function close() {
    removeModal(ModalCategory.JoinPreview)
  }

  useMount(fetchAllowances)

  return (
    <div className={styles.previewModal}>
      <header className={styles.header}>
        <h1 className={styles.title}>Join Pool Preview</h1>
        <button
          className={styles.closeButton}
          type="button"
          onClick={close}
          aria-label="Close"
        >
          <Icon id="close" />
        </button>
      </header>

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
