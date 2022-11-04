import { memo, useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { format, formatDistanceToNow } from 'date-fns'

import { ModalCategory } from 'states/ui'
import {
  isCooldownWindowAtom,
  isWithdrawWindowAtom,
  roundedTimestampsAtom,
  timestampsAtom,
} from 'states/user'
import { fadeIn } from 'constants/motionVariants'
import { datetimePattern } from 'constants/time'
import { useModal } from 'hooks'

import { StyledActionDropdownMenuUnstakePeriod } from './styled'
import SvgIcon from 'components/SvgIcon'
import Timer from './Timer'

function ActionDropdownMenuUnstakePeriod() {
  const { addModal } = useModal()
  const [cooldownEndsAt, withdrawEndsAt] = useAtomValue(timestampsAtom)
  const [roundedCooldownEndsAt, roundedWithdrawEndsAt] = useAtomValue(
    roundedTimestampsAtom
  )
  const isCooldownWindow = useAtomValue(isCooldownWindowAtom)
  const isWithdrawWindow = useAtomValue(isWithdrawWindowAtom)

  const currentPhase = useMemo(
    () => (isCooldownWindow ? `Cooldown` : `Withdraw`),
    [isCooldownWindow]
  )

  const endsAt = useMemo(
    () => (isCooldownWindow ? cooldownEndsAt : withdrawEndsAt),
    [cooldownEndsAt, isCooldownWindow, withdrawEndsAt]
  )

  const timeDistanceDesc = `Withdraw window ${
    isCooldownWindow ? `starts` : `ends`
  } ${formatDistanceToNow(endsAt, { addSuffix: true })}`

  function withdraw() {
    if (!isWithdrawWindow) return
    addModal({
      category: ModalCategory.Cooldown,
    })
  }

  return (
    <StyledActionDropdownMenuUnstakePeriod
      className="unstakePeriod"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeIn}
      onClick={isWithdrawWindow ? withdraw : undefined}
      role={isWithdrawWindow ? 'button' : undefined}
      $active={isWithdrawWindow}
    >
      <header className="header">
        {isCooldownWindow && <SvgIcon icon="lock" />}
        <h3 className="title">{currentPhase} period</h3>
      </header>

      <dl className="detailList" style={{ position: 'relative' }}>
        <div className="detailItem timeDistance">
          <dt className="hidden">Time left</dt>
          <dd aria-label={timeDistanceDesc}>
            <span
              style={{
                fontSize: 10,
                position: 'absolute',
                top: 0,
                zIndex: 10,
                left: 0,
                background: 'black',
              }}
            >
              {timeDistanceDesc}
            </span>
            <Timer expiresAt={endsAt} /> left
          </dd>
        </div>

        <div className="detailItem timePeriod">
          <dt className="hidden">Withdraw window starts at</dt>
          <dd>
            <time dateTime={roundedCooldownEndsAt.toString()}>
              {format(roundedCooldownEndsAt, datetimePattern)}
            </time>
          </dd>
          <dt className="hidden">Withdraw window ends at</dt>
          <dd className="tilde">
            <time dateTime={roundedWithdrawEndsAt.toString()}>
              {format(roundedWithdrawEndsAt, datetimePattern)}
            </time>
          </dd>
        </div>
      </dl>
    </StyledActionDropdownMenuUnstakePeriod>
  )
}

export default memo(ActionDropdownMenuUnstakePeriod)
