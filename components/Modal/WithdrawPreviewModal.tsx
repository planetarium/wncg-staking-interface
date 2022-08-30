import { useState } from 'react'
import { toast } from 'react-toastify'
import styles from './WithdrawPreviewModal.module.scss'

import { ModalCategory } from 'app/states/modal'
import { addToast } from 'app/states/toast'
import { TransactionAction } from 'services/transaction'
import { gaEvent } from 'lib/gtag'
import { countUpOption, usdCountUpOption } from 'utils/countUp'
import { handleError } from 'utils/error'
import { toastAnimation } from 'utils/toast'
import { getTokenSymbol } from 'utils/token'
import {
  useAppDispatch,
  useFiatCurrency,
  useModal,
  useRewards,
  useTimer,
  useUnstake,
  useUnstakeTimestamps,
  usePool,
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

  const { poolTokenName, poolTokenSymbols } = usePool()
  const { rewards, rewardsInFiatValue, rewardTokensList } = useRewards()
  const { withdrawEndsAt } = useUnstakeTimestamps()

  const dispatch = useAppDispatch()

  const { removeModal } = useModal()
  const { getBptFiatValue } = useFiatCurrency()
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
      handleError(error, TransactionAction.Withdraw)
    }
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

  return (
    <div className={styles.withdrawPreviewModal}>
      <h1 className={styles.title}>Withdrawal Preview</h1>

      <h3 className={styles.subtitle}>Withdraw amount</h3>

      <dl className={styles.withdrawDetail}>
        <dt>
          <div className={styles.tokens} title={poolTokenName}>
            {poolTokenSymbols.map((symbol) => (
              <TokenIcon
                key={`withdrawPreviewToken.${symbol}`}
                className={styles.token}
                symbol={symbol}
              />
            ))}
          </div>
          <CountUp {...countUpOption} decimals={8} end={amount} />
        </dt>

        <dd>
          <CountUp
            {...usdCountUpOption}
            className={styles.usd}
            end={getBptFiatValue(amount)}
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
