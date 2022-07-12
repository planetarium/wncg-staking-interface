import { useState } from 'react'
import { toast } from 'react-toastify'
import Image from 'next/image'
import clsx from 'clsx'
import styles from './WithdrawPreviewModal.module.scss'

import { ModalCategory } from 'app/states/modal'
import { getEarnedBal, getEarnedWncg } from 'app/states/reward'
import { addToast } from 'app/states/toast'
import { TransactionAction } from 'app/states/transaction'
import { getWithdrawEndsAt } from 'app/states/unstake'
import { gaEvent } from 'lib/gtag'
import { countUpOption, usdCountUpOption } from 'utils/countUp'
import { sanitizeNumber } from 'utils/num'
import { toastAnimation } from 'utils/toast'
import {
  useAppDispatch,
  useAppSelector,
  useError,
  useModal,
  useTimer,
  useUnstake,
  useUsd,
} from 'hooks'

import { Button } from 'components/Button'
import { CountUp } from 'components/CountUp'
import { Icon } from 'components/Icon'
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

  const dispatch = useAppDispatch()
  const withdrawEndsAt = useAppSelector(getWithdrawEndsAt)
  const balReward = useAppSelector(getEarnedBal)
  const wncgReward = useAppSelector(getEarnedWncg)
  const bal = parseFloat(sanitizeNumber(balReward))
  const wncg = parseFloat(sanitizeNumber(wncgReward))

  const { handleError } = useError()
  const { removeModal } = useModal()
  const { calculateUsdValue } = useUsd()
  const { withdrawAndClaim } = useUnstake()

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
      await withdrawAndClaim(amount)
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
            <span className={clsx(styles.token, styles.ether)}>
              <Icon id="ethereumSimple" />
            </span>
            <span className={clsx(styles.token, styles.wncg)}>
              <Image
                src="/img-wncg.png"
                layout="fill"
                objectFit="contain"
                priority
                alt=""
              />
            </span>
          </div>
          <CountUp {...countUpOption} decimals={8} end={withdrawAmount} />
        </dt>

        <dd>
          <CountUp
            {...usdCountUpOption}
            className={styles.usd}
            end={calculateUsdValue('bpt', withdrawAmount)}
            isApproximate
          />
        </dd>
      </dl>

      <h3 className={styles.subtitle}>Rewards</h3>
      <dl className={styles.claimDetail}>
        <div className={styles.detailItem}>
          <dt>
            <span className={clsx(styles.token, styles.wncg)} title="WNCG">
              <Image
                src="/img-wncg.png"
                layout="fill"
                objectFit="contain"
                priority
                alt="WNCG"
              />
            </span>
            <CountUp
              {...countUpOption}
              className={styles.reward}
              end={wncg}
              decimals={8}
              duration={0.5}
            />
            <strong className="hidden">WNCG</strong>
          </dt>
          <dd>
            <CountUp
              {...usdCountUpOption}
              className={styles.usd}
              end={calculateUsdValue('wncg', wncg)}
              isApproximate
            />
          </dd>
        </div>

        <div className={styles.detailItem}>
          <dt>
            <span className={clsx(styles.token, styles.balancer)} title="BAL">
              <Icon id="balancer" />
            </span>
            <CountUp
              {...countUpOption}
              className={styles.reward}
              end={bal}
              decimals={8}
              duration={0.5}
            />
            <strong className="hidden">BAL</strong>
          </dt>
          <dd>
            <CountUp
              {...usdCountUpOption}
              className={styles.usd}
              end={calculateUsdValue('bal', bal)}
              isApproximate
            />
          </dd>
        </div>
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
