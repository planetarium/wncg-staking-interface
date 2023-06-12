import { fetchBalance, fetchToken } from '@wagmi/core'

export async function fetchPoolTokens(
  chainId: ChainId,
  lpTokenAddress: Hash,
  addresses: Hash[]
): Promise<PoolToken[]> {
  const tokenPromises = addresses.map((addr) =>
    fetchToken({
      address: addr,
      chainId,
    })
  )

  try {
    const tokens = await Promise.all(tokenPromises)

    const balancePromises = tokens.map((t) =>
      fetchBalance({
        address: lpTokenAddress,
        chainId,
        formatUnits: t.decimals,
        token: t.address,
      })
    )

    try {
      const balances = await Promise.all(balancePromises)

      return tokens.map((t, i) => ({
        address: t.address.toLowerCase() as Hash,
        balance: balances[i].formatted,
        weight: '0.5',
        name: t.name,
        symbol: t.symbol,
        decimals: t.decimals,
      }))
    } catch (error) {
      return tokens.map((t, i) => ({
        address: t.address.toLowerCase() as Hash,
        balance: '0',
        weight: '0.5',
        name: t.name,
        symbol: t.symbol,
        decimals: t.decimals,
      }))
    }
  } catch (error) {
    return []
  }
}
