import { MouseEvent, useCallback, useEffect, useState } from 'react'
import type { Event } from 'ethers'
import styles from './style.module.scss'

import { ModalCategory } from 'app/states/modal'
import { TxAction } from 'services/transaction'
import { renderTxErrorMessage, txToastTitle } from 'utils/transaction'
import {
  useEvents,
  useExitPool,
  useModal,
  usePool,
  useProvider,
  useToast,
} from 'hooks'

import { Button } from 'components/Button'
import PreviewComposition from './Composition'
import PreviewSummary from './Summary'
import { PreviewWarning } from './Warning'

type ExitPreviewModalProps = {
  amounts: string[]
  exactOut: boolean
  isProportional: boolean
  isNativeAsset: boolean
  percent: number
  priceImpact: number
  rektPriceImpact: boolean
  tokenOutAmount: string
  tokenOutIndex: number
  totalFiatValue: string
}

export function ExitPreviewModal({
  amounts,
  exactOut,
  isProportional,
  isNativeAsset,
  percent,
  priceImpact,
  rektPriceImpact,
  tokenOutAmount,
  tokenOutIndex,
  totalFiatValue,
}: ExitPreviewModalProps) {
  const disabled = rektPriceImpact

  const [loading, setLoading] = useState(false)
  const [pendingTx, setPendingTx] = useState('')
  const [showClose, setShowClose] = useState(disabled)
  const [error, setError] = useState<any>(null)

  const { poolBalanceChangedEvent } = useEvents()
  const { exitPool } = useExitPool()
  const { removeModal } = useModal()
  const { poolName } = usePool()
  const provider = useProvider()
  const { addCustomToast } = useToast()

  function closeModal() {
    removeModal(ModalCategory.ExitPreview)
  }

  async function handleExit(e: MouseEvent) {
    e.stopPropagation()

    if (showClose) {
      closeModal()
      return
    }

    setError(null)
    setLoading(true)

    try {
      const hash = await exitPool({
        exactOut,
        isNativeAsset,
        isProportional,
        percent,
        tokenOutIndex,
        tokenOutAmount,
      })
      if (hash) {
        setPendingTx(hash)
      }
    } catch (error: any) {
      setLoading(false)
      if (error.code === 4001) return
      setError(error)
      addCustomToast({
        title: txToastTitle(TxAction.ExitPool),
        message: renderTxErrorMessage(TxAction.ExitPool, poolName),
        type: 'error',
      })
    }
  }

  const poolBalanceChangedHandler = useCallback(
    ({ transactionHash }: Event) => {
      if (loading && pendingTx === transactionHash) {
        setLoading(false)
        setShowClose(true)
        setPendingTx('')
      }
    },
    [loading, pendingTx]
  )

  useEffect(() => {
    if (poolBalanceChangedEvent) {
      provider?.on(poolBalanceChangedEvent, poolBalanceChangedHandler)
      return () => {
        provider?.off(poolBalanceChangedEvent)
      }
    }
  })

  return (
    <div className={styles.previewModal}>
      <h1 className={styles.title}>Exit Pool Preview</h1>

      <PreviewComposition
        amounts={amounts}
        isNativeAsset={isNativeAsset}
        totalFiatValue={totalFiatValue}
      />
      <PreviewSummary
        priceImpact={priceImpact}
        totalFiatValue={totalFiatValue}
      />

      <PreviewWarning rektPriceImpact={rektPriceImpact} error={error} />

      <footer className={styles.footer}>
        <Button
          variant={showClose ? 'secondary' : 'primary'}
          size="large"
          onClick={handleExit}
          fullWidth
          loading={loading}
          disabled={disabled || loading}
        >
          {showClose ? 'Close' : 'Exit pool'}
        </Button>
      </footer>
    </div>
  )
}
