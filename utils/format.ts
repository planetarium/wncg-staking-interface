import { format as _format } from 'date-fns'

type FormatOptions = {
  dateOnly?: boolean
  showSeconds?: boolean
  pattern?: string
}

export function format(date?: number, options?: FormatOptions) {
  if (!date) return null

  const pattern = getPattern(options)
  return _format(date * 1_000, pattern)
}

function getPattern(options: FormatOptions = {}) {
  const { dateOnly, showSeconds, pattern } = options

  switch (true) {
    case typeof pattern === 'string':
      return pattern as string
    case dateOnly === true:
      return `MMM/dd/yyyy`
    default:
      return `MMM/dd/yyyy HH:mm${showSeconds ? ':ss' : ''}`
  }
}
