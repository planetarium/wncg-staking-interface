const SECOND = 1_000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

export function timeAgo(timestamp: number) {
  if (!timestamp) {
    return ''
  }

  const today = new Date().getTime()
  const delta = today - timestamp * 1_000

  const days = Math.floor(delta / DAY)
  const hours = Math.floor((delta % DAY) / HOUR)
  const minutes = Math.floor((delta % HOUR) / MINUTE)
  const months = Math.floor(days / 30)

  if (months >= 1) {
    if (months === 1) return `about a month ago`
    return `about ${months} months ago`
  }

  if (days === 0) {
    if (!hours) {
      if (minutes <= 1) return `a minute ago`
      return `${minutes} minutes ago`
    }
    return `about ${hours} hours ago`
  }

  if (hours >= 12) return `${days + 1} days ago`
  return `${days} days ago`
}
