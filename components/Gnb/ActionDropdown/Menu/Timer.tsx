import { useTimer } from 'hooks'

type CooldownPeriodTimerProps = {
  expiresAt: number
}

function CooldownPeriodTimer({ expiresAt }: CooldownPeriodTimerProps) {
  const { days, hours, minutes, seconds } = useTimer(expiresAt)

  return (
    <time>
      {days ? `${days}d ` : null}
      {hours ? `${hours}h ` : null}
      {minutes ? `${minutes}m ` : null}
      {seconds}s
    </time>
  )
}

export default CooldownPeriodTimer
