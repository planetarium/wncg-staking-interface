import { BigNumber } from 'ethers'

import { PancakeRouterAbi } from 'config/abi'
import { CHAINS } from 'config/chains'
import { DEX_PROTOCOL_ADDRESS } from 'config/constants/addresses'
import { calcSlippageAmount } from 'utils/calcSlippageAmount'
import { parseUnits } from 'utils/parseUnits'

export function prepareAddLiquidity(
  chainId: ChainId,
  account: Hash,
  assets: Hash[],
  amountsIn: string[],
  slippage = '0.5',
  deadline: string
) {
  const { nativeCurrency } = CHAINS[chainId]
  const hasNativeCurrency = assets.includes(nativeCurrency.address)

  const scaledAmountsIn = amountsIn.map((amt, i) => parseUnits(amt).toString())

  const scaledMinAmountsIn = scaledAmountsIn.map(
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
        scaledAmountsIn[tokenIndex],
        scaledMinAmountsIn[tokenIndex],
        scaledMinAmountsIn[ethIndex],
        account,
        deadline,
      ]
    : [...assets, ...scaledAmountsIn, ...scaledMinAmountsIn, account, deadline]

  const contract = {
    address: DEX_PROTOCOL_ADDRESS[chainId] as Hash,
    abi: PancakeRouterAbi as Abi,
    chainId,
    functionName: hasNativeCurrency ? 'addLiquidityETH' : 'addLiquidity',
    args,
    value: hasNativeCurrency ? BigInt(scaledAmountsIn[ethIndex]) : undefined,
  }

  return contract
}
