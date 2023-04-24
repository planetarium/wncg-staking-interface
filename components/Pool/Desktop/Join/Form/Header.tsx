import { memo } from 'react'
import { useSetAtom } from 'jotai'

import { optimizeErrorAtom } from 'states/form'
import { useStaking } from 'hooks'

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
  const { stakedTokenAddress } = useStaking()

  const setShowError = useSetAtom(optimizeErrorAtom)

  function handleOptimize() {
    optimize()
    setShowError(true)
  }

  return (
    <StyledJoinFormHeader className="joinFormHeader">
      <h3 className="title">
        <TokenIcon address={stakedTokenAddress} $size={24} />
        Join pool
      </h3>

      <div className="buttonGroup">
        <Button
          className="optimizeButton"
          onClick={handleOptimize}
          disabled={optimized}
          $contain
          $size="sm"
        >
          Optimize{optimized ? 'd' : ''}
        </Button>

        <button
          className="resetButton"
          type="reset"
          onClick={reset}
          disabled={resetDisabled}
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
