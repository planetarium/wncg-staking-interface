import { MouseEvent, useCallback, useEffect, useState } from 'react'
import { useMount } from 'react-use'
import Image from 'next/image'
import clsx from 'clsx'
import styles from './ClaimRewardModal.module.scss'

import { ModalCategory } from 'app/states/modal'
import { getEarnedBal, getEarnedWncg } from 'app/states/reward'
import { TransactionAction } from 'app/states/transaction'
import { gaEvent } from 'lib/gtag'
import { assertUnreachable } from 'utils/assertion'
import { countUpOption, usdCountUpOption } from 'utils/countUp'
import { handleError } from 'utils/error'
import Decimal, { sanitizeNumber } from 'utils/num'
import {
  useAppSelector,
  useClaim,
  useEventFilter,
  useModal,
  useProvider,
  useReward,
  useUsd,
} from 'hooks'

import { Button } from 'components/Button'
import { CountUp } from 'components/CountUp'
import { Icon } from 'components/Icon'

type ClaimLoading = 'all' | 'bal' | 'wncg' | null

export function ClaimRewardModal() {
  const [loading, setLoading] = useState<ClaimLoading>(null)

  const { claimAllRewards, claimBalRewards, claimWncgRewards } = useClaim()
  const { rewardsBalEventFilter, rewardsWncgEventFilter } = useEventFilter()
  const { removeModal } = useModal()
  const provider = useProvider()
  const { earnedBal, earnedWncg } = useReward()
  const { calculateUsdValue } = useUsd()

  const balReward = useAppSelector(getEarnedBal)
  const wncgReward = useAppSelector(getEarnedWncg)
  const bal = parseFloat(sanitizeNumber(balReward))
  const wncg = parseFloat(sanitizeNumber(wncgReward))

  const balDisabled =
    new Decimal(balReward).isZero() || ['bal', 'all'].includes(loading || '')
  const wncgDisabled =
    new Decimal(wncgReward).isZero() || ['wncg', 'all'].includes(loading || '')
  const disableAll = (balDisabled && wncgDisabled) || loading === 'all'

  async function handleClaim(e: MouseEvent) {
    const { name } = e.currentTarget as HTMLButtonElement

    let txAction: TransactionAction
    switch (name) {
      case 'all':
        txAction = TransactionAction.ClaimAllRewards
        break
      case 'bal':
        txAction = TransactionAction.ClaimBalRewards
        break
      case 'wncg':
        txAction = TransactionAction.ClaimWncgRewards
        break
      default:
        assertUnreachable(name)
    }

    try {
      gaEvent({
        name: `claim_${name}`,
      })
      if (name === 'bal') {
        setLoading('bal')
        await claimBalRewards()
      } else if (name === 'wncg') {
        setLoading('wncg')
        await claimWncgRewards()
      } else {
        setLoading('all')
        await claimAllRewards()
      }
      removeModal(ModalCategory.ClaimReward)
    } catch (error) {
      setLoading(null)
      handleError(error, txAction)
    }
  }

  const handleRewardEvent = useCallback(() => {
    setLoading(null)
  }, [])

  useMount(() => {
    earnedBal()
    earnedWncg()
  })

  // NOTE: Reward BAL event
  useEffect(() => {
    if (rewardsBalEventFilter) {
      provider?.on(rewardsBalEventFilter, handleRewardEvent)
      return () => {
        provider?.off(rewardsBalEventFilter)
      }
    }
  }, [handleRewardEvent, provider, rewardsBalEventFilter])

  // NOTE: Reward WNCG event
  useEffect(() => {
    if (rewardsWncgEventFilter) {
      provider?.on(rewardsWncgEventFilter, handleRewardEvent)
      return () => {
        provider?.off(rewardsWncgEventFilter)
      }
    }
  }, [handleRewardEvent, provider, rewardsWncgEventFilter])

  return (
    <div className={styles.claimRewardModal}>
      <h1 className={styles.title}>Claim Rewards</h1>

      <dl className={styles.detail}>
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
            <strong className="hidden">WNCG</strong>
          </dt>
          <dd>
            <CountUp
              {...countUpOption}
              className={styles.reward}
              end={wncg}
              decimals={8}
              duration={0.5}
            />
            <CountUp
              {...usdCountUpOption}
              className={styles.usd}
              end={calculateUsdValue('wncg', wncg)}
              isApproximate
            />
          </dd>
          <dd className={styles.isBig}>
            <Button
              variant="secondary"
              size="small"
              name="wncg"
              onClick={handleClaim}
              loading={loading === 'wncg'}
              disabled={wncgDisabled}
              fullWidth
            >
              Claim WNCG
            </Button>
          </dd>
        </div>

        <div className={styles.detailItem}>
          <dt>
            <span className={clsx(styles.token, styles.balancer)} title="BAL">
              <Icon id="balancer" />
            </span>
            <strong className="hidden">BAL</strong>
          </dt>
          <dd>
            <CountUp
              {...countUpOption}
              className={styles.reward}
              end={bal}
              decimals={8}
              duration={0.5}
            />
            <CountUp
              {...usdCountUpOption}
              className={styles.usd}
              end={calculateUsdValue('bal', bal)}
              isApproximate
            />
          </dd>
          <dd className={styles.isBig}>
            <Button
              variant="secondary"
              size="small"
              name="bal"
              onClick={handleClaim}
              loading={loading === 'bal'}
              disabled={balDisabled}
              fullWidth
            >
              Claim BAL
            </Button>
          </dd>
        </div>
      </dl>
      <Button
        size="large"
        name="all"
        onClick={handleClaim}
        loading={loading === 'all'}
        disabled={disableAll}
        fullWidth
      >
        Claim all rewards
      </Button>
    </div>
  )
}
