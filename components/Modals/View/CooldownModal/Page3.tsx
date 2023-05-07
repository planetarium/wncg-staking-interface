import { useAtomValue } from 'jotai'

import { unstakeTimestampsAtom } from 'states/account'
import { format } from 'utils/format'
import { useModal, useStaking } from 'hooks'

import { StyledCooldownModalPage3 } from './styled'
import Button from 'components/Button'
import Lottie from 'components/Lottie'

export default function CooldownModalPage3() {
  const { removeModal } = useModal()
  const { cooldownPeriod } = useStaking()

  const { cooldownEndsAt = 0, withdrawEndsAt = 0 } =
    useAtomValue(unstakeTimestampsAtom) ?? {}

  const cooldownStartsAt = Math.max(0, cooldownEndsAt - cooldownPeriod)

  return (
    <StyledCooldownModalPage3>
      <div className="lottieContainer">
        <Lottie animationData="timer" />
      </div>

      <header className="modalHeader">
        <h2 className="title">Cooldown started!</h2>
      </header>

      <div className="container">
        <div className="modalContent">
          <dl className="scheduleList">
            <div className="scheduleItem">
              <dt>Cooldown</dt>
              <dd>
                <time>{format(cooldownStartsAt, { dateOnly: true })}</time>
                <time className="tilde">
                  {format(cooldownEndsAt, { dateOnly: true })}
                </time>
              </dd>
            </div>
            <div className="scheduleItem">
              <dt>Withdraw</dt>
              <dd>
                <time>{format(cooldownEndsAt, { dateOnly: true })}</time>
                <time className="tilde">
                  {format(withdrawEndsAt, { dateOnly: true })}
                </time>
              </dd>
              <dd className="misc">
                If you don&apos;t withdraw during this period, you&apos;ll have
                to go through the cooldown again. So keep this withdrawal window
                in mind.
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <footer className="modalFooter">
        <Button type="button" onClick={removeModal} $size="md">
          Go to main
        </Button>
      </footer>
    </StyledCooldownModalPage3>
  )
}
