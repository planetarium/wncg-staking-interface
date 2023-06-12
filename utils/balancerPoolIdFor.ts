export function balancerPoolIdFor(chainId: ChainId) {
  if (chainId === 1)
    return '0xe8cc7e765647625b95f59c15848379d10b9ab4af0002000000000000000001de'

  if (chainId === 5)
    return '0x16faf9f73748013155b7bc116a3008b57332d1e600020000000000000000005b'

  return null
}
