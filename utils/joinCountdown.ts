import { bnum } from './bnum'

export function joinCountdown(
  _days: string | number,
  _hours: string | number,
  _minutes: string | number,
  _seconds: string | number,
  options: { abbr?: boolean } = {}
) {
  const { abbr } = options

  const days = bnum(_days).isZero()
    ? null
    : abbr
    ? `${_days}d`
    : bnum(_days).eq(1)
    ? '1day'
    : `${_days}days`

  const hours =
    days === null && bnum(_hours).isZero()
      ? null
      : abbr
      ? `${_hours}h`
      : bnum(_hours).eq(1)
      ? '1hour'
      : `${_hours}hours`

  const minutes =
    hours === null && bnum(_minutes).isZero()
      ? null
      : abbr
      ? `${_minutes}m`
      : bnum(_minutes).eq(1)
      ? '1min'
      : `${_minutes}mins`

  const seconds =
    minutes === null && bnum(_seconds).isZero()
      ? null
      : abbr
      ? `${_seconds}s`
      : bnum(_seconds).eq(1)
      ? '1sec'
      : `${_seconds}secs`

  const textArray = [days, hours, minutes, seconds].filter(
    (item) => item !== null
  )

  return textArray.join(' ')
}
