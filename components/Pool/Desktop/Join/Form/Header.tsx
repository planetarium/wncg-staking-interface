import { memo } from 'react'
import { useSetAtom } from 'jotai'

import { showOptimizeErrorAtom } from 'states/form'
import { useAuth, useStaking } from 'hooks'

import { StyledJoinFormHeader } from './styled'
import Button from 'components/Button'
import Icon from 'components/Icon'
import SlippageControl from 'components/SlippageControl'
import TokenIcon from 'components/TokenIcon'

type JoinFormHeaderProps = {
  optimize(): void
  optimized: boolean
  reset(): void
  resetDisabled: boolean
}

function JoinFormHeader({
  optimize,
  optimized,
  reset,
  resetDisabled,
}: JoinFormHeaderProps) {
  const { isConnected } = useAuth()
  const { stakedTokenAddress } = useStaking()

  const setShowOptError = useSetAtom(showOptimizeErrorAtom)

  function handleOptimize() {
    optimize()
    setShowOptError(true)
  }

  function handleReset() {
    reset()
    setShowOptError(false)
  }

  return (
    <StyledJoinFormHeader className="joinFormHeader" $disabled={!isConnected}>
      <h3 className="title">
        <TokenIcon address={stakedTokenAddress} $size={24} />
        Join pool
      </h3>

      <div className="buttonGroup">
        <Button
          className="optimizeButton"
          onClick={handleOptimize}
          disabled={optimized || !isConnected}
          $contain
          $size="sm"
        >
          Optimize{optimized ? 'd' : ''}
        </Button>

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

      <SlippageControl />
    </StyledJoinFormHeader>
  )
}

export default memo(JoinFormHeader)
