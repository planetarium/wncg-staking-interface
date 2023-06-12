import { DAY, MONTH, WEEK, YEAR } from 'config/constants/time'
import { assertUnreachable } from 'utils/assertUnreachable'

export type Span = 'day' | 'week' | 'month' | 'year'

export function getDistance(key: 'day' | 'week' | 'month' | 'year') {
  switch (key) {
    case 'day':
      return DAY
    case 'week':
      return WEEK
    case 'month':
      return MONTH
    case 'year':
      return YEAR
    default:
      assertUnreachable(key)
  }
}
