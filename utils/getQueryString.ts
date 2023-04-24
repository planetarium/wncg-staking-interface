export function getQueryString(query: string | string[] | undefined) {
  if (!query) return ''
  if (typeof query === 'string') return query
  if (!!query[0]) return query[0]
  return ''
}
