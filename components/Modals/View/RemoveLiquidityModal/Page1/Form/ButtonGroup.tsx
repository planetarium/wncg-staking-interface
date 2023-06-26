import type { MouseEvent } from 'react'
import type { UseFormSetValue } from 'react-hook-form'

import { RemoveLiquidityField } from 'config/constants'
import { bnum } from 'utils/bnum'
import { RemoveLiquidityForm } from 'hooks/pancakeswap/useRemoveLiquidityForm'

import { StyledRemoveLiquidityModalPage1FormButtonGroup } from './styled'
import Button from 'components/Button'

const RATIO_LIST = [25, 50, 75, 100]

type RemoveLiquidityModalPage1FormButtonGroupProps = {
  exitPcnt: string
  setValue: UseFormSetValue<RemoveLiquidityForm>
  disabled?: boolean
}

export default function RemoveLiquidityModalPage1FormButtonGroup({
  exitPcnt,
  setValue,
  disabled,
}: RemoveLiquidityModalPage1FormButtonGroupProps) {
  function onRatioButtonClick(e: MouseEvent) {
    const { value } = e.currentTarget as HTMLButtonElement
    setValue(RemoveLiquidityField.Percent, value)
  }

  return (
    <StyledRemoveLiquidityModalPage1FormButtonGroup>
      {RATIO_LIST.map((ratio) => {
        return (
          <Button
            className="ratioButton"
            key={`exitModal:buttonGroup:${ratio}`}
            value={ratio}
            onClick={onRatioButtonClick}
            disabled={disabled}
            $variant={bnum(exitPcnt).eq(ratio) ? 'primary' : 'tertiary'}
            $size="md"
          >
            {ratio}%
          </Button>
        )
      })}
    </StyledRemoveLiquidityModalPage1FormButtonGroup>
  )
}
