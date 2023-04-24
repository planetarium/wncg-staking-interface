import { formatISO } from 'date-fns'

import { toEpoch } from './toEpoch'

export function now() {
  const time = Date.now()
  const parsedTime = formatISO(time)
  return toEpoch(parsedTime) ?? 0
}
