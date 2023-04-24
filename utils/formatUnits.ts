import { formatUnits as _formatUnits } from 'ethers/lib/utils'

export function formatUnits(
  value?: BigNumber | string | null,
  decimals: number = 18
): string {
  return _formatUnits(value?.toString() ?? '0', decimals)
}
