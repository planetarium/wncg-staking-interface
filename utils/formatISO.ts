import _formatISO from 'date-fns/formatISO'

export function formatISO(timestamp?: number) {
  if (!timestamp) return undefined
  return _formatISO(timestamp * 1_000)
}
