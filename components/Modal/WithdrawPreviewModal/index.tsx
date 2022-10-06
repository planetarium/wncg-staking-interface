import { useState } from 'react'
import styles from '../style.module.scss'

import { ModalCategory } from 'states/ui'
import { gaEvent } from 'lib/gtag'
import { parseTxError } from 'utils/tx'
import {
  useModal,
  useTimer,
  useToast,
  useUnstake,
  useUnstakeTimestamps,
} from 'hooks'

import { Button } from 'components/Button'
import { Icon } from 'components/Icon'
import { RewardsSummary } from './RewardsSummary'
import { WithdrawSummary } from './WithdrawSummary'

const toastContent = {
  title: 'Withdrawal window expired',
  message: 'Withdrawal window expired. You need to cooldown again to withdraw.',
}

type WithdrawPreviewModalProps = {
  amount: string
  resetForm(): void
}

function WithdrawPreviewModal({
  amount,
  resetForm,
}: WithdrawPreviewModalProps) {
  const [loading, setLoading] = useState(false)

  const { removeModal } = useModal()
  const { addToast } = useToast()
  const { withdraw } = useUnstake()
  const { withdrawEndsAt } = useUnstakeTimestamps()

  function close() {
    removeModal(ModalCategory.WithdrawPreview)
  }

  async function handleWithdraw() {
    gaEvent({
      name: 'withdraw_and_claim',
    })

    try {
      setLoading(true)
      await withdraw(amount, true)
      resetForm()
      close()
    } catch (error) {
      setLoading(false)
      const errorMsg = parseTxError(error)
      if (errorMsg) {
        addToast({
          ...errorMsg,
          type: 'error',
        })
      }
    }
  }

  function onExpiration() {
    addToast(toastContent)
    close()
  }

  useTimer(withdrawEndsAt, onExpiration)

  return (
    <div className={styles.withdrawPreviewModal}>
      <header className={styles.header}>
        <h1 className={styles.title}>Withdrawal Preview</h1>
        <button
          className={styles.closeButton}
          type="button"
          onClick={close}
          aria-label="Close"
        >
          <Icon id="close" />
        </button>
      </header>

      <h3 className={styles.subtitle}>Withdraw amount</h3>
      <WithdrawSummary amount={amount} />

      <h3 className={styles.subtitle}>Rewards</h3>
      <RewardsSummary />

      <Button
        onClick={handleWithdraw}
        size="large"
        fullWidth
        loading={loading}
        disabled={loading}
      >
        Withdraw
      </Button>
    </div>
  )
}

export default WithdrawPreviewModal
