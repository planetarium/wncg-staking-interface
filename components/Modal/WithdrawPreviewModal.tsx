import { useState } from 'react'
import { toast } from 'react-toastify'
import styles from './WithdrawPreviewModal.module.scss'

import { ModalCategory } from 'app/states/modal'
import { addToast } from 'app/states/toast'
import { TransactionAction } from 'services/transaction'
import { getWithdrawEndsAt } from 'app/states/unstake'
import { gaEvent } from 'lib/gtag'
import { countUpOption, usdCountUpOption } from 'utils/countUp'
import { handleError } from 'utils/error'
import { getTokenSymbol } from 'utils/token'
import { sanitizeNumber } from 'utils/num'
import { toastAnimation } from 'utils/toast'
import {
  useAppDispatch,
  useAppSelector,
  useModal,
  useRewardData,
  useTimer,
  useUnstake,
  useUsd,
} from 'hooks'

import { Button } from 'components/Button'
import { CountUp } from 'components/CountUp'
import { TokenIcon } from 'components/TokenIcon'
import { CustomToast } from 'components/Toast/CustomToast'

type WithdrawPreviewModalProps = {
  amount: string
  resetForm(): void
}

export function WithdrawPreviewModal({
  amount,
  resetForm,
}: WithdrawPreviewModalProps) {
  const [loading, setLoading] = useState(false)

  const { rewards, rewardsInFiatValue, rewardTokensList } = useRewardData()

  const dispatch = useAppDispatch()
  const withdrawEndsAt = useAppSelector(getWithdrawEndsAt)

  const { removeModal } = useModal()
  const { getBptFiatValue } = useUsd()
  const { withdraw } = useUnstake()

  const withdrawAmount = parseFloat(sanitizeNumber(amount))

  function close() {
    removeModal(ModalCategory.WithdrawPreview)
  }

  function onExpiration() {
    const toastId = `withdrawPreview-${Date.now()}`
    close()
    toast(
      <CustomToast
        title="Withdrawal window expired"
        description="Withdrawal window expired. You need to cooldown again to withdraw."
      />,
      {
        transition: toastAnimation,
        toastId,
      }
    )
    dispatch(addToast(toastId))
  }

  useTimer(withdrawEndsAt, onExpiration)

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
      handleError(error, TransactionAction.Withdraw)
    }
  }

  return (
    <div className={styles.withdrawPreviewModal}>
      <h1 className={styles.title}>Withdrawal Preview</h1>

      <h3 className={styles.subtitle}>Withdraw amount</h3>

      <dl className={styles.withdrawDetail}>
        <dt>
          <div className={styles.tokens} title="20WETH-80WNCG">
            <TokenIcon className={styles.token} symbol="weth" />
            <TokenIcon className={styles.token} symbol="wncg" />
          </div>
          <CountUp {...countUpOption} decimals={8} end={withdrawAmount} />
        </dt>

        <dd>
          <CountUp
            {...usdCountUpOption}
            className={styles.usd}
            end={getBptFiatValue(withdrawAmount)}
            isApproximate
          />
        </dd>
      </dl>

      <h3 className={styles.subtitle}>Rewards</h3>
      <dl className={styles.claimDetail}>
        {rewardTokensList.map((address, i) => {
          const symbol = getTokenSymbol(address)
          const amount = rewards[i]
          const fiatValue = rewardsInFiatValue[i]

          return (
            <div
              key={`withdrawPreview.${address}`}
              className={styles.detailItem}
            >
              <dt>
                <TokenIcon className={styles.token} symbol={symbol} />
                <CountUp
                  {...countUpOption}
                  className={styles.reward}
                  end={amount}
                  decimals={8}
                  duration={0.5}
                />
                <strong className="hidden">{symbol}</strong>
              </dt>
              <dd>
                <CountUp
                  {...usdCountUpOption}
                  className={styles.usd}
                  end={fiatValue}
                  isApproximate
                />
              </dd>
            </div>
          )
        })}
      </dl>

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
