import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

import { ModalType } from 'config/constants'
import { useCountdown, useModal } from 'hooks'
import { useFetchUserData } from 'hooks/queries'
import {
  cooldownWindowAtom,
  unstakeTimestampsAtom,
  withdrawWindowAtom,
} from 'states/account'
import { bnum } from 'utils/bnum'
import { joinCountdown } from 'utils/joinCountdown'

import { StyledWalletUnstakeWindow } from './styled'

type WalletUnstakeWindowProps = {
  closeWallet(): void
}

export default function WalletUnstakeWindow({
  closeWallet,
}: WalletUnstakeWindowProps) {
  const cooldownWindow = useAtomValue(cooldownWindowAtom)
  const withdrawWindow = useAtomValue(withdrawWindowAtom)
  const unstakeTimestamps = useAtomValue(unstakeTimestampsAtom)

  const { stakedTokenBalance = '0' } = useFetchUserData().data ?? {}
  const hasStakedLp = bnum(stakedTokenBalance).gt(0)

  const { addModal } = useModal()

  const period = useMemo(
    () => (cooldownWindow ? 'Cooldown' : 'Withdraw'),
    [cooldownWindow]
  )

  const expiresAt = useMemo(
    () =>
      (cooldownWindow
        ? unstakeTimestamps?.cooldownEndsAt
        : unstakeTimestamps?.withdrawEndsAt) ?? 0,
    [
      cooldownWindow,
      unstakeTimestamps?.cooldownEndsAt,
      unstakeTimestamps?.withdrawEndsAt,
    ]
  )

  const { days, hours, minutes, seconds } = useCountdown(expiresAt, {
    enabled: expiresAt > 0,
    leadingZero: false,
  })

  const countdown = joinCountdown(days, hours, minutes, seconds, {
    abbr: true,
  })

  if (!unstakeTimestamps || !hasStakedLp) {
    return <StyledWalletUnstakeWindow>hi</StyledWalletUnstakeWindow>
  }

  function openUnstake() {
    addModal({
      type: ModalType.Unstake,
    })
    closeWallet()
  }

  return (
    <StyledWalletUnstakeWindow
      $unstake={withdrawWindow}
      onClick={withdrawWindow ? openUnstake : undefined}
      role={withdrawWindow ? 'button' : undefined}
    >
      <h4 className="title">{period}</h4>

      <div className="content">
        <strong className="timer">
          {countdown} {countdown && 'left'}
        </strong>
      </div>
    </StyledWalletUnstakeWindow>
  )
}
