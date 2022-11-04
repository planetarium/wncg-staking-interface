import { memo, useMemo } from 'react'
import type { UseFormRegister } from 'react-hook-form'
import type { StateValue } from 'xstate'
import { useAtom } from 'jotai'
import { AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

import { pendingClaimTxAtom } from 'states/form'
import { ModalCategory } from 'states/ui'
import { usdCountUpOption } from 'constants/countUp'
import { bnum } from 'utils/num'
import { useFiatCurrency } from 'hooks'
import { useClaim } from '../useClaim'
import { ClaimFormFields } from '../useClaimForm'

import { StyledClaimRewardModalPage1 } from './styled'
import { CloseButton, PendingNotice } from 'components/Modals/shared'
import CountUp from 'components/CountUp'
import SvgIcon from 'components/SvgIcon'
import TxButton from 'components/TxButton'
import SelectRewards from './SelectRewards'

type ClaimRewardModalPage1Props = {
  currentPage: number
  currentState: StateValue
  register: UseFormRegister<ClaimFormFields>
  send(value: string): void
  tokensToClaim: string[]
  rewardsToClaim?: string[]
}

function ClaimRewardModalPage1({
  currentPage,
  currentState,
  register,
  send,
  tokensToClaim,
  rewardsToClaim = [],
}: ClaimRewardModalPage1Props) {
  const { toFiat } = useFiatCurrency()

  const [pendingTx, setPendingTx] = useAtom(pendingClaimTxAtom)

  const claim = useClaim(tokensToClaim, {
    onConfirm(txHash?: Hash) {
      setPendingTx({
        tokensToClaim,
        rewardsToClaim,
        hash: txHash,
      })
      send('CALL')
    },
    onError(error) {
      if (error?.code === 'ACTION_REJECTED') return
      if (error?.code === 4001) return
      send('FAIL')
    },
  })

  const isPending = currentState === 'claimPending' && !!pendingTx.hash
  const disabled = useMemo(
    () => isPending || !tokensToClaim.length,
    [isPending, tokensToClaim.length]
  )

  const totalValue = useMemo(
    () =>
      rewardsToClaim
        .reduce(
          (total, amount, i) => total.plus(toFiat(tokensToClaim[i], amount)),
          bnum(0)
        )
        .toString(),
    [rewardsToClaim, toFiat, tokensToClaim]
  )

  const enabled = bnum(totalValue).gt(0)

  return (
    <AnimatePresence>
      {currentPage === 1 && (
        <StyledClaimRewardModalPage1>
          <header className="modalHeader">
            <div className="titleGroup">
              <h2 className="title accent">Claim rewards</h2>
              <h3 className="subtitle">Select the all coins to get Rewards</h3>
            </div>
            <CloseButton modal={ModalCategory.ClaimReward} />
          </header>

          <SelectRewards register={register} isPending={isPending} />

          <output className="checkout">
            <span className="text">You can get</span>
            <div className={clsx('value', { enabled })}>
              <SvgIcon icon="approximate" $size={24} />
              <CountUp {...usdCountUpOption} end={totalValue} />
            </div>
          </output>

          <TxButton onClick={claim} isPending={isPending} disabled={disabled}>
            Claim reward{tokensToClaim.length === 1 ? '' : 's'}
          </TxButton>

          <PendingNotice hash={pendingTx.hash} />
        </StyledClaimRewardModalPage1>
      )}
    </AnimatePresence>
  )
}

export default memo(ClaimRewardModalPage1)
