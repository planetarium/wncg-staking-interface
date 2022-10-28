import { memo } from 'react'
import { useSetAtom } from 'jotai'

import { optimizeErrorAtom } from 'states/form'
import { usePool } from 'hooks'

import { StyledJoinFormHeader } from './styled'
import Button from 'new/Button'
import SlippageDropdown from 'new/SlippageDropdown'
import SvgIcon from 'new/SvgIcon'
import TokenIcon from 'new/TokenIcon'

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
  const { poolTokenAddresses } = usePool()

  const setShowError = useSetAtom(optimizeErrorAtom)

  function handleOptimize() {
    optimize()
    setShowError(true)
  }

  return (
    <StyledJoinFormHeader className="joinFormHeader">
      <h3 className="title">
        <div className="tokens">
          {poolTokenAddresses.map((address) => (
            <TokenIcon key={`joinFormHeader:${address}`} address={address} />
          ))}
        </div>
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
          <SvgIcon icon="refresh" $size={32} />
        </button>
      </div>

      <SlippageDropdown />
    </StyledJoinFormHeader>
  )
}

export default memo(JoinFormHeader)
