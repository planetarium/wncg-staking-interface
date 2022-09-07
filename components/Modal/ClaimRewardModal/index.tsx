import { MouseEvent, useState } from 'react'
import { useMount } from 'react-use'
import { useRecoilValue } from 'recoil'
import styles from './ClaimRewardModal.module.scss'

import { connectedState } from 'app/states/connection'
import { ModalCategory } from 'app/states/modal'
import { TxAction } from 'services/transaction'
import { gaEvent } from 'lib/gtag'
import { parseTxError } from 'utils/error'
import { bnum } from 'utils/num'
import { txToastTitle } from 'utils/transaction'
import { useClaim, useModal, useRewards, useToast } from 'hooks'

import { Button } from 'components/Button'
import { Icon } from 'components/Icon'
import { ClaimRewardEffects } from './Effects'
import { RewardItem } from './RewardItem'

export function ClaimRewardModal() {
  const [loading, setLoading] = useState<string | null>(null)
  const isConnected = useRecoilValue(connectedState)

  const { claimAllRewards, claimBalRewards, claimWncgRewards } = useClaim()
  const { removeModal } = useModal()
  const { rewards, rewardsInFiatValue, rewardTokenSymbols, fetchRewards } =
    useRewards()
  const { addTxToast } = useToast()

  const claimTypes = ['all', ...rewardTokenSymbols].map((item) =>
    item.toLowerCase()
  )
  const claimMethods = [claimAllRewards, claimWncgRewards, claimBalRewards]
  const claimActions = [
    TxAction.ClaimAll,
    TxAction.ClaimWncg,
    TxAction.ClaimBal,
  ]

  const claimAllDisabled =
    !isConnected ||
    rewards.every((reward) => bnum(reward).isZero()) ||
    claimTypes.includes(loading || '')

  function close() {
    removeModal(ModalCategory.ClaimReward)
  }

  async function handleClaim(e: MouseEvent) {
    const { name } = e.currentTarget as HTMLButtonElement
    setLoading(name)
    gaEvent({
      name: `claim_${name}`,
    })
    const index = claimTypes.findIndex((type) => type === name)

    try {
      await claimMethods[index]()
    } catch (error: any) {
      setLoading(null)
      if (error.code === 4001) return
      const action = claimActions[index]
      const errorMsg = parseTxError(error)
      addTxToast({
        action,
        title: txToastTitle(action, 'error'),
        message: errorMsg!.message,
        type: 'error',
      })
    }
  }

  useMount(() => {
    fetchRewards()
  })

  return (
    <div className={styles.claimRewardModal}>
      <header className={styles.header}>
        <h1 className={styles.title}>Claim Rewards</h1>
        <button
          className={styles.closeButton}
          type="button"
          onClick={close}
          aria-label="Close"
        >
          <Icon id="close" />
        </button>
      </header>

      <dl className={styles.detail}>
        {rewardTokenSymbols.map((symbol, i) => (
          <RewardItem
            key={`claimRewardModal.${symbol}`}
            amount={rewards[i]}
            handleClaim={handleClaim}
            fiatValue={rewardsInFiatValue[i]}
            loading={loading}
            symbol={symbol}
          />
        ))}
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

      <ClaimRewardEffects setLoading={setLoading} />
    </div>
  )
}
