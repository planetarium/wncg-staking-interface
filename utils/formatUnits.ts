import { formatUnits as _formatUnits } from 'viem'

export function formatUnits(
  value?: BigNumber | string | null,
  decimals: number = 18
): string {
  return _formatUnits(BigInt(value?.toString() ?? '0'), decimals)
}
