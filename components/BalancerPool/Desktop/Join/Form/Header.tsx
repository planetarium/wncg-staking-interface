import { useAtomValue } from 'jotai'

import { joinTxAtom } from 'states/tx'
import { useAuth, useStaking } from 'hooks'
import { JoinPoolFormElement } from 'hooks/balancer/useJoinForm'

import { StyledJoinFormHeader } from './styled'
import Button from 'components/Button'
import Icon from 'components/Icon'
import SlippageControl from 'components/SlippageControl'
import TokenIcon from 'components/TokenIcon'
import Tooltip from 'components/Tooltip'

type BalancerJoinFormHeaderProps = {
  optimize(): void
  optimized: boolean
  reset(): void
  resetDisabled: boolean
  setFocusedElement(value: JoinPoolFormElement): void
}

function BalancerJoinFormHeader({
  optimize,
  optimized,
  reset,
  resetDisabled,
  setFocusedElement,
}: BalancerJoinFormHeaderProps) {
  const { isConnected } = useAuth()
  const { lpToken } = useStaking()

  const tx = useAtomValue(joinTxAtom)

  function handleReset() {
    reset()
    setFocusedElement(null)
  }

  return (
    <StyledJoinFormHeader className="joinFormHeader" $disabled={!isConnected}>
      <h3 className="title">
        <TokenIcon address={lpToken?.address} $size={24} />
        Join pool
      </h3>

      <div className="buttonGroup">
        <div className="tooltipGroup">
          <Button
            className="optimizeButton toggler"
            onClick={optimize}
            disabled={optimized || !isConnected}
            $contain
            $size="sm"
          >
            Optimize{optimized ? 'd' : ''}
          </Button>
          <Tooltip
            message={`Join ${lpToken?.name} pool with the optimized ratio`}
            $noWrap
            $direction="bottom"
          />
        </div>

        <button
          className="resetButton"
          type="reset"
          onClick={handleReset}
          disabled={resetDisabled || !isConnected}
          aria-label="Reset"
        >
          <Icon icon={resetDisabled ? 'refreshOff' : 'refreshOn'} $size={32} />
        </button>
      </div>

      <SlippageControl disabled={!!tx.hash} />
    </StyledJoinFormHeader>
  )
}

export default BalancerJoinFormHeader
