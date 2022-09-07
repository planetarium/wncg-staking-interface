import { MouseEvent, useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { Event } from 'ethers'
import styles from './style.module.scss'

import { ModalCategory } from 'app/states/modal'
import { TxAction } from 'services/transaction'
import { txToastTitle } from 'utils/transaction'
import { useEvents, useExitPool, useModal, useProvider, useToast } from 'hooks'

import { Button } from 'components/Button'
import { Icon } from 'components/Icon'
import PreviewComposition from './Composition'
import PreviewSummary from './Summary'
import { PreviewWarning } from './Warning'
import { parseTxError } from 'utils/error'

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
  const provider = useProvider()
  const { addTxToast } = useToast()

  const showWarning = rektPriceImpact || !!error

  function close() {
    removeModal(ModalCategory.ExitPreview)
  }

  async function handleExit(e: MouseEvent) {
    e.stopPropagation()

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
      const errorMsg = parseTxError(error)
      setError(error)
      addTxToast({
        action: TxAction.ExitPool,
        title: txToastTitle(TxAction.ExitPool, 'error'),
        message: errorMsg!.message,
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
      <header className={styles.header}>
        <h1 className={styles.title}>Exit Pool Preview</h1>
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

      <AnimatePresence>
        {showWarning && (
          <PreviewWarning rektPriceImpact={rektPriceImpact} error={error} />
        )}
      </AnimatePresence>

      {!showClose && (
        <footer className={styles.footer}>
          <Button
            size="large"
            onClick={handleExit}
            fullWidth
            loading={loading}
            disabled={disabled || loading}
          >
            Exit pool
          </Button>
        </footer>
      )}
    </div>
  )
}
