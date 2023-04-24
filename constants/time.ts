export const SECOND = 1
export const MINUTE_IN_SEC = SECOND * 60
export const HOUR_IN_SEC = MINUTE_IN_SEC * 60
export const DAY_IN_SEC = HOUR_IN_SEC * 24
export const YEAR_IN_SEC = DAY_IN_SEC * 365

export const SECOND_IN_MS = 1_000
export const MINUTE_IN_MS = MINUTE_IN_SEC * 1_000
export const HOUR_IN_MS = HOUR_IN_SEC * 1_000
export const DAY_IN_MS = DAY_IN_SEC * 1_000
export const YEAR_IN_MS = YEAR_IN_SEC * 1_000

export const REFETCH_INTERVAL = 15 * 1_000
export const STALE_TIME = 10 * 1_000

export const ESTIMATION_PERIODS = ['day', 'week', 'month', 'year'] as const
export type EstimatePeriod = (typeof ESTIMATION_PERIODS)[number]

export const datePattern = 'yyyy. MM. dd'
export const datetimePattern = `${datePattern} hh:mm bb`
