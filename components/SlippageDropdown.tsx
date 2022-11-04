import { MouseEvent } from 'react'
import { useAtomValue } from 'jotai'
import clsx from 'clsx'

import { slippageAtom } from 'states/userSettings'
import { bnum } from 'utils/num'
import { useSettings } from 'hooks'

import { StyledSlippageDropdown } from './styled'
import Dropdown from './Dropdown'

const SLIPPAGE_LIST = ['0.5', '1', '2']

type SlippageDropdownProps = {
  className?: string
  disabled?: boolean
}

function SlippageDropdown({ className, disabled }: SlippageDropdownProps) {
  const { updateSlippage } = useSettings()
  const slippage = useAtomValue(slippageAtom) || 0

  function handleSlippage(e: MouseEvent<HTMLButtonElement>) {
    updateSlippage(e.currentTarget.value)
  }

  // TODO: Add custom input
  return (
    <StyledSlippageDropdown className={clsx('slippageDropdown', className)}>
      <strong>Slippage tolerance</strong>
      <Dropdown
        id="slippage"
        list={SLIPPAGE_LIST}
        onChange={handleSlippage}
        value={slippage.toString()}
        formatter={formatSlippage}
        disabled={disabled}
      />
    </StyledSlippageDropdown>
  )
}

export default SlippageDropdown

function formatSlippage(value: string) {
  if (SLIPPAGE_LIST.some((item) => bnum(item).eq(value))) {
    return `${bnum(value).toFixed(1)}%`
  }

  return `${bnum(value).toFixed(1)}%`
}
