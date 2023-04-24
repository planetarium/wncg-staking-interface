export function uniqAddress(addresses: Array<Hash | undefined>) {
  return [
    ...new Set(addresses.filter((v) => typeof v === 'string' && !!v) as Hash[]),
  ]
}
