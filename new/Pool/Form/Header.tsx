import type { MouseEvent } from 'react'
import { useAtomValue } from 'jotai'

import { slippageAtom } from 'states/userSettings'
import { bnum } from 'utils/num'
import { useSettings } from 'hooks'
import { usePoolData } from '../usePoolData'

import { StyledPoolFormHeader } from './styled'
import Button from 'new/Button'
import Dropdown from 'new/Dropdown'
import SvgIcon from 'new/SvgIcon'
import TokenIcon from 'new/TokenIcon'

const slippageList = ['0.5', '1', '2']

function PoolFormHeader() {
  const { poolTokenAddresses } = usePoolData()
  const { updateSlippage } = useSettings()
  const slippage = useAtomValue(slippageAtom) || 0

  function handleSlippage(e: MouseEvent<HTMLButtonElement>) {
    updateSlippage(e.currentTarget.value)
  }

  return (
    <StyledPoolFormHeader>
      <h3 className="title">
        <div className="tokens">
          {poolTokenAddresses.map((address) => (
            <TokenIcon key={`poolFormHeader:${address}`} address={address} />
          ))}
        </div>
        Join pool
      </h3>

      <div className="buttonGroup">
        <Button
          className="optimizeButton"
          $variant="tertiary"
          $size="sm"
          $contain
        >
          Optimize
        </Button>
        <button
          className="refreshButton"
          type="reset"
          aria-label="Reset the form"
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
    </StyledPoolFormHeader>
  )
}

export default PoolFormHeader

function formatSlippage(value: string) {
  console.log(`${bnum(value).toFixed(1)}%`)
  if (slippageList.some((item) => bnum(item).eq(value))) {
    return `${bnum(value).toFixed(1)}%`
  }

  return `${bnum(value).toFixed(1)}%`
}
