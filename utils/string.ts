export function truncateAddress(address: string, start = 6, end = 4) {
  return `${address.slice(0, start)}...${address.slice(end * -1)}`
}

export function formatTimer(value: number) {
  return String(value).padStart(2, '0')
}
