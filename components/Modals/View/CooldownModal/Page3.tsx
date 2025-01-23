import { useAtomValue } from 'jotai'

import { unstakeTimestampsAtom } from 'states/account'
import { format } from 'utils/format'
import { useModal, useStaking } from 'hooks'

import { StyledCooldownModalPage3 } from './styled'
import Button from 'components/Button'
import Lottie from 'components/Lottie'

export default function CooldownModalPage3() {
  const { removeModal } = useModal()
  const { cooldownSeconds } = useStaking()

  const { cooldownEndsAt = 0, withdrawEndsAt = 0 } =
    useAtomValue(unstakeTimestampsAtom) ?? {}

  const cooldownStartsAt = Math.max(0, cooldownEndsAt - cooldownSeconds)

  return (
    <StyledCooldownModalPage3>
      <div className="lottieContainer">
        <Lottie animationData="timer" />
      </div>

      <header className="modalHeader">
        <h2 className="title">Cooldown started!</h2>
      </header>

      <footer className="modalFooter">
        <Button type="button" onClick={removeModal} $size="md">
          Go to main
        </Button>
      </footer>
    </StyledCooldownModalPage3>
  )
}
