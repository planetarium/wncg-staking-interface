import { useAuth, useStaking } from 'hooks'
import type { AddLiquidityFormElement } from 'hooks/pancakeswap/useAddLiquidityForm'

import { StyledAddLiquidityFormUtils } from './styled'
import Button from 'components/Button'
import Tooltip from 'components/Tooltip'

type AddLiquidityFormUtilsProps = {
  optimized: boolean
  optimize(): void
  focusedElement: AddLiquidityFormElement
}

export default function AddLiquidityFormUtils({
  optimized,
  optimize,
  focusedElement,
}: AddLiquidityFormUtilsProps) {
  const { isConnected } = useAuth()
  const { lpToken } = useStaking()

  const disabled = !isConnected || (optimized && focusedElement === 'Optimize')

  return (
    <StyledAddLiquidityFormUtils className="tooltipGroup">
      <Button
        className="optimizeButton toggler"
        onClick={optimize}
        $size="sm"
        $contain
        disabled={disabled}
      >
        {optimized && focusedElement === 'Optimize' ? 'Optimized' : 'Optimize'}
      </Button>

      <Tooltip
        $align="right"
        $direction="bottom"
        $noWrap
        message={`Join ${lpToken.name} pool with the optimized ratio`}
      />
    </StyledAddLiquidityFormUtils>
  )
}
