import { memo } from 'react'
import type { MouseEvent } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import { slippageAtom } from 'states/userSettings'
import { bnum } from 'utils/num'
import { useSettings } from 'hooks'
import { usePoolData } from '../../usePoolData'

import { StyledJoinFormHeader } from './styled'
import Button from 'new/Button'
import Dropdown from 'new/Dropdown'
import SvgIcon from 'new/SvgIcon'
import TokenIcon from 'new/TokenIcon'
import { optimizeErrorAtom } from 'states/form'

const slippageList = ['0.5', '1', '2']

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
  const { poolTokenAddresses } = usePoolData()
  const { updateSlippage } = useSettings()

  const slippage = useAtomValue(slippageAtom) || 0
  const setShowError = useSetAtom(optimizeErrorAtom)

  function handleSlippage(e: MouseEvent<HTMLButtonElement>) {
    updateSlippage(e.currentTarget.value)
  }

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

      <div className="slippageDropdown">
        <strong>Slippage tolerance</strong>
        {/* TODO: Add custom input */}
        <Dropdown
          id="slippage"
          list={slippageList}
          onChange={handleSlippage}
          value={slippage.toString()}
          formatter={formatSlippage}
        />
      </div>
    </StyledJoinFormHeader>
  )
}

export default memo(JoinFormHeader)

function formatSlippage(value: string) {
  if (slippageList.some((item) => bnum(item).eq(value))) {
    return `${bnum(value).toFixed(1)}%`
  }

  return `${bnum(value).toFixed(1)}%`
}
