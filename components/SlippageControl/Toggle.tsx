import { memo, MouseEvent } from 'react'

import { useResponsive } from 'hooks'
import { SLIPPAGE_TOLERANCES } from './useSlippageForm'

import { StyledSlippageControlToggle } from './styled'
import Icon from 'components/Icon'
import NumberFormat from 'components/NumberFormat'
import Tooltip from 'components/Tooltip'

type SlippageControlToggleProps = {
  show: boolean
  toggle(e: MouseEvent<HTMLButtonElement>): void
  value: string
  disabled: boolean
}

function SlippageControlToggle({
  show,
  toggle,
  value,
  disabled,
}: SlippageControlToggleProps) {
  const { isMobile } = useResponsive()

  return (
    <StyledSlippageControlToggle
      className="slippageToggle"
      $disabled={disabled}
    >
      <label className="label tooltipGroup" htmlFor="slippageControl">
        Slippage tolerance
        <Icon className="toggler" icon="info" />
        <Tooltip
          $gap={8}
          $direction={isMobile ? 'bottom' : 'top'}
          $align="center"
        >
          High slippage tolerance may incur significant losses.{' '}
          <br className="afterMobile" />
          So the slippage tolerance setting is limited to &lt;30%.
        </Tooltip>
      </label>

      <button
        className="toggleButton"
        type="button"
        onClick={toggle}
        disabled={disabled}
        aria-controls="menu"
        aria-haspopup
      >
        <NumberFormat value={value} decimals={2} maxDecimals={2} symbol="%" />
        <Icon icon={show ? 'chevronUp' : 'chevronDown'} />
      </button>

      <select
        className="hidden"
        id="slippageControl"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={false}
        aria-controls="slippageControlMenu"
      >
        {SLIPPAGE_TOLERANCES.map((option) => (
          <option key={`slippageControl:${option}`} value={option}>
            {option}
          </option>
        ))}
      </select>
    </StyledSlippageControlToggle>
  )
}

export default memo(SlippageControlToggle)
