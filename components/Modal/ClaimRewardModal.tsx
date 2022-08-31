import { MouseEvent, useCallback, useEffect, useState } from 'react'
import { useMount } from 'react-use'
import { useRecoilValue } from 'recoil'
import styles from './ClaimRewardModal.module.scss'

import { connectedState } from 'app/states/connection'
import { ModalCategory } from 'app/states/modal'
import { gaEvent } from 'lib/gtag'
import { countUpOption, usdCountUpOption } from 'utils/countUp'
import { handleError } from 'utils/error'
import { bnum } from 'utils/num'
import { useClaim, useEvents, useModal, useProvider, useRewards } from 'hooks'

import { Button } from 'components/Button'
import { CountUp } from 'components/CountUp'
import { TokenIcon } from 'components/TokenIcon'

export function ClaimRewardModal() {
  const [loading, setLoading] = useState('')

  const { claimAllRewards, claimBalRewards, claimWncgRewards } = useClaim()
  const { rewardsClaimedBalEvent, rewardsClaimedWncgEvent } = useEvents()
  const { removeModal } = useModal()
  const provider = useProvider()
  const { rewards, rewardsInFiatValue, rewardTokenSymbols, fetchRewards } =
    useRewards()

  const loadingStates = ['all', ...rewardTokenSymbols].map((item) =>
    item.toLowerCase()
  )

  const isConnected = useRecoilValue(connectedState)

  const claimAllDisabled =
    !isConnected ||
    rewards.every((reward) => bnum(reward).isZero()) ||
    loadingStates.includes(loading)

  async function handleClaim(e: MouseEvent) {
    const { name } = e.currentTarget as HTMLButtonElement

    setLoading(name)
    gaEvent({
      name: `claim_${name}`,
    })

    try {
      let handler: () => Promise<void>

      if (name === 'all') {
        handler = claimAllRewards
      } else if (name === 'bal') {
        handler = claimBalRewards
      } else {
        handler = claimWncgRewards
      }

      await handler()
      removeModal(ModalCategory.ClaimReward)
    } catch (error) {
      setLoading('')
      handleError(error)
    }
  }

  const rewardsClaimedHandler = useCallback(() => {
    setLoading('')
  }, [])

  useMount(() => {
    fetchRewards()
  })

  // NOTE: Reward BAL event
  useEffect(() => {
    if (rewardsClaimedBalEvent) {
      provider?.on(rewardsClaimedBalEvent, rewardsClaimedHandler)
      return () => {
        provider?.off(rewardsClaimedBalEvent)
      }
    }
  }, [rewardsClaimedHandler, provider, rewardsClaimedBalEvent])

  // NOTE: Reward WNCG event
  useEffect(() => {
    if (rewardsClaimedWncgEvent) {
      provider?.on(rewardsClaimedWncgEvent, rewardsClaimedHandler)
      return () => {
        provider?.off(rewardsClaimedWncgEvent)
      }
    }
  }, [rewardsClaimedHandler, provider, rewardsClaimedWncgEvent])

  return (
    <div className={styles.claimRewardModal}>
      <h1 className={styles.title}>Claim Rewards</h1>

      <dl className={styles.detail}>
        {rewardTokenSymbols.map((symbol, i) => {
          symbol = symbol.toLowerCase()
          const amount = rewards[i]
          const fiatValue = rewardsInFiatValue[i]

          const disabled =
            !isConnected ||
            bnum(amount).isZero() ||
            [symbol, 'all'].includes(loading)

          return (
            <div
              key={`claimRewardModal.${symbol}`}
              className={styles.detailItem}
            >
              <dt>
                <TokenIcon className={styles.token} symbol={symbol} />
                <strong className="hidden">{symbol.toUpperCase()}</strong>
              </dt>
              <dd>
                <CountUp
                  {...countUpOption}
                  className={styles.reward}
                  end={amount}
                  decimals={8}
                  duration={0.5}
                />
                <CountUp
                  {...usdCountUpOption}
                  className={styles.usd}
                  end={fiatValue}
                  isApproximate
                />
              </dd>
              <dd className={styles.isBig}>
                <Button
                  variant="secondary"
                  size="small"
                  name={symbol}
                  onClick={handleClaim}
                  loading={loading === symbol}
                  disabled={disabled}
                  fullWidth
                >
                  Claim {symbol.toUpperCase()}
                </Button>
              </dd>
            </div>
          )
        })}
      </dl>

      <Button
        size="large"
        name="all"
        onClick={handleClaim}
        loading={loading === 'all'}
        disabled={claimAllDisabled}
        fullWidth
      >
        Claim all rewards
      </Button>
    </div>
  )
}
