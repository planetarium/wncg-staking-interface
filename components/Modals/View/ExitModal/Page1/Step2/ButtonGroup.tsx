import type { MouseEvent } from 'react'
import type { UseFormSetValue } from 'react-hook-form'

import { LiquidityFieldType } from 'config/constants'
import { bnum } from 'utils/bnum'
import type { ExitFormFields } from 'hooks/balancer/useExitForm'

import { StyledExitModalPage1Step2ButtonGroup } from './styled'
import Button from 'components/Button'

const RATIO_LIST = [25, 50, 75, 100]

type ExitModalPage1FormButtonGroupProps = {
  bptOutPcnt: string
  setValue: UseFormSetValue<ExitFormFields>
  disabled?: boolean
}

export default function ExitModalPage1FormButtonGroup({
  bptOutPcnt,
  setValue,
  disabled,
}: ExitModalPage1FormButtonGroupProps) {
  function onRatioButtonClick(e: MouseEvent) {
    const { value } = e.currentTarget as HTMLButtonElement
    setValue(LiquidityFieldType.LiquidityPercent, value as `${number}`)
  }

  return (
    <StyledExitModalPage1Step2ButtonGroup>
      {RATIO_LIST.map((ratio) => {
        return (
          <Button
            className="ratioButton"
            key={`exitModal:buttonGroup:${ratio}`}
            value={ratio}
            onClick={onRatioButtonClick}
            $variant={bnum(bptOutPcnt).eq(ratio) ? 'primary' : 'tertiary'}
            $size="md"
            disabled={disabled}
          >
            {ratio}%
          </Button>
        )
      })}
    </StyledExitModalPage1Step2ButtonGroup>
  )
}
