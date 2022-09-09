import { useState } from 'react'
import styles from '../style.module.scss'

import { ModalCategory } from 'app/states/modal'
import { gaEvent } from 'lib/gtag'
import { parseTxError } from 'utils/error'
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

export function WithdrawPreviewModal({
  amount,
  resetForm,
}: WithdrawPreviewModalProps) {
  const [loading, setLoading] = useState(false)

  const { addCustomToast, addErrorToast } = useToast()
  const { withdrawEndsAt } = useUnstakeTimestamps()

  const { removeModal } = useModal()

  const { withdraw } = useUnstake()

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
        addErrorToast({
          ...errorMsg,
        })
      }
    }
  }

  function onExpiration() {
    addCustomToast(toastContent)
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