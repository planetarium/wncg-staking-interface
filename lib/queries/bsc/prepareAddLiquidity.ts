import { PancakeRouterAbi } from 'config/abi'
import { CHAINS } from 'config/chains'
import { DEX_PROTOCOL_ADDRESS } from 'config/constants/addresses'
import { MINUTE } from 'config/misc'
import { BigNumber } from 'ethers'
import { calcSlippageAmount } from 'utils/calcSlippageAmount'
import { now } from 'utils/now'
import { parseUnits } from 'utils/parseUnits'

export function prepareAddLiquidity(
  chainId: ChainId,
  account: Hash,
  assets: Hash[],
  joinAmounts: string[],
  slippage = '0.5'
) {
  const { nativeCurrency } = CHAINS[chainId]
  const DEADLINE = `0x${(now() + 3 * MINUTE).toString(16)}`
  const hasNativeCurrency = assets.includes(nativeCurrency.address)

  const scaledJoinAmounts = joinAmounts.map((amt, i) =>
    parseUnits(amt).toString()
  )

  const scaledMinJoinAmounts = scaledJoinAmounts.map(
    (amt) => calcSlippageAmount(amt, slippage)[0]
  )

  const ethIndex = assets.findIndex(
    (addr) =>
      addr === nativeCurrency.address ||
      addr === nativeCurrency.wrappedTokenAddress
  )
  const tokenIndex = 1 - ethIndex

  const args = hasNativeCurrency
    ? [
        assets[tokenIndex],
        scaledJoinAmounts[tokenIndex],
        scaledMinJoinAmounts[tokenIndex],
        scaledMinJoinAmounts[ethIndex],
        account,
        DEADLINE,
      ]
    : [
        ...assets,
        ...scaledJoinAmounts,
        ...scaledMinJoinAmounts,
        account,
        DEADLINE,
      ]

  const contract = {
    address: DEX_PROTOCOL_ADDRESS[chainId] as Hash,
    abi: PancakeRouterAbi as Abi,
    chainId,
    functionName: hasNativeCurrency ? 'addLiquidityETH' : 'addLiquidity',
    args,
  }

  const overrides = hasNativeCurrency
    ? {
        value: BigNumber.from(scaledJoinAmounts[ethIndex]),
      }
    : undefined

  return {
    contract,
    overrides,
  }
}
