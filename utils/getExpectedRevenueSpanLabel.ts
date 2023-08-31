import { assertUnreachable } from './assertUnreachable'

export function getExpectedRevenueSpanLabel(span: string) {
  switch (span) {
    case 'day':
      return 'In a day'
    case 'week':
      return '7 days'
    case 'month':
      return '30 days'
    case 'year':
      return '365 days'
    default:
      assertUnreachable(span)
  }
}
