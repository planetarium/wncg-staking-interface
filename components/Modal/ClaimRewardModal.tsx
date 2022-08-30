import { MouseEvent, useCallback, useEffect, useState } from 'react'
import { useMount } from 'react-use'
import styles from './ClaimRewardModal.module.scss'

import { getIsConnected } from 'app/states/connection'
import { ModalCategory } from 'app/states/modal'
import { TransactionAction } from 'services/transaction'
import { gaEvent } from 'lib/gtag'
import { assertUnreachable } from 'utils/assertion'
import { countUpOption, usdCountUpOption } from 'utils/countUp'
import { handleError } from 'utils/error'
import { bnum } from 'utils/num'
import { getTokenSymbol } from 'utils/token'
import {
  useAppSelector,
  useClaim,
  useEventFilters,
  useModal,
  useProvider,
  useRewardData,
} from 'hooks'

import { Button } from 'components/Button'
import { CountUp } from 'components/CountUp'
import { TokenIcon } from 'components/TokenIcon'

const LOADING_STATES = ['all', 'bal', 'wncg']

export function ClaimRewardModal() {
  const [loading, setLoading] = useState<string>('')

  const { claimAllRewards, claimBalRewards, claimWncgRewards } = useClaim()
  const { rewardsBalEventFilter, rewardsWncgEventFilter } = useEventFilters()
  const { removeModal } = useModal()
  const provider = useProvider()
  const { rewards, rewardsInFiatValue, rewardTokensList, fetchRewards } =
    useRewardData()

  const isConnected = useAppSelector(getIsConnected)

  const claimAllDisabled = !isConnected || LOADING_STATES.includes(loading)

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
      setLoading('')
      handleError(error, txAction)
    }
  }

  const handleRewardEvent = useCallback(() => {
    setLoading('')
  }, [])

  useMount(() => {
    fetchRewards()
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
        {rewardTokensList.map((address, i) => {
          const symbol = getTokenSymbol(address).toLowerCase()
          const amount = rewards[i]
          const fiatValue = rewardsInFiatValue[i]

          const disabled =
            !isConnected ||
            bnum(amount).isZero() ||
            [symbol, 'all'].includes(loading)

          return (
            <div
              key={`claimRewardModal.${address}`}
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
