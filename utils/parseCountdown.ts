import { DAY, HOUR, MINUTE, SECOND } from 'config/misc'

export function parseCountdown(timestamp: number, leadingZero: boolean) {
  const days = Math.max(0, Math.floor(timestamp / DAY))
  const hours = Math.max(0, Math.floor((timestamp % DAY) / HOUR))
  const minutes = Math.max(0, Math.floor((timestamp % HOUR) / MINUTE))
  const seconds = Math.max(0, Math.floor((timestamp % MINUTE) / SECOND))

  return {
    days: leadingZero ? String(days).padStart(2, '0') : days,
    hours: leadingZero ? String(hours).padStart(2, '0') : hours,
    minutes: leadingZero ? String(minutes).padStart(2, '0') : minutes,
    seconds: leadingZero ? String(seconds).padStart(2, '0') : seconds,
  }
}
