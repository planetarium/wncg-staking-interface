export function truncateAddress(address?: string, start = 6, end = 4) {
  if (!address) return ''
  return `${address.slice(0, start)}...${address.slice(end * -1)}`
}
