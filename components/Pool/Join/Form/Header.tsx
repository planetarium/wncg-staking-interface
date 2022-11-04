import { memo } from 'react'
import { useSetAtom } from 'jotai'

import { optimizeErrorAtom } from 'states/form'
import { usePool } from 'hooks'

import { StyledJoinFormHeader } from './styled'
import Button from 'components/Button'
import SlippageDropdown from 'components/SlippageDropdown'
import SvgIcon from 'components/SvgIcon'
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
