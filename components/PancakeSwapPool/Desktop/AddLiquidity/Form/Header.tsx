import { useAtomValue } from 'jotai'

import { addLiquidityTxAtom } from 'states/tx'
import { useAuth, useStaking } from 'hooks'
import { AddLiquidityFormElement } from 'hooks/pancakeswap/useAddLiquidityForm'

import { StyledPancakeSwapPoolHeader } from './styled'
import Button from 'components/Button'
import SlippageControl from 'components/SlippageControl'
import TokenIcon from 'components/TokenIcon'
import Tooltip from 'components/Tooltip'

type PancakeSwapAddLiquidityHeaderProps = {
  optimize(): void
  optimized: boolean
  focusedElement: AddLiquidityFormElement
}

export default function PancakeSwapAddLiquidityHeader({
  optimize,
  optimized,
  focusedElement,
}: PancakeSwapAddLiquidityHeaderProps) {
  const { isConnected } = useAuth()
  const { lpToken } = useStaking()

  const tx = useAtomValue(addLiquidityTxAtom)

  const optimizeDisabled = optimized && focusedElement === 'Optimize'

  const disabled = !isConnected || !!tx.hash

  return (
    <StyledPancakeSwapPoolHeader className="header" $disabled={disabled}>
      <h2 className="title">
        <div className="token">
          <TokenIcon address={lpToken?.address} $size={28} />
        </div>
        Join pool
      </h2>

      <SlippageControl />

      <div className="buttonGroup tooltipGroup">
        <Button
          className="optimizeButton toggler"
          onClick={optimize}
          $size="sm"
          $contain
          disabled={disabled || optimizeDisabled}
        >
          {optimized && focusedElement === 'Optimize'
            ? 'Optimized'
            : 'Optimize'}
        </Button>

        <Tooltip
          $align="right"
          $direction="bottom"
          $noWrap
          message={`Join ${lpToken?.name} pool with the optimized ratio`}
        />
      </div>
    </StyledPancakeSwapPoolHeader>
  )
}
