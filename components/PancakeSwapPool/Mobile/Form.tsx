import { useAtomValue } from 'jotai'
import { useUnmount } from 'react-use'

import { addLiquidityAtom } from 'states/tx'
import type { UseAddLiquidityFormReturns } from 'hooks/pancakeswap/useAddLiquidityForm'

import { StyledPancakeSwapPoolMobileForm } from './styled'
import Button from 'components/Button'
import { Fieldset, UnoptimizableAlert } from 'components/PancakeSwapPool/shared'
import SlippageControl from 'components/SlippageControl'

type PancakeSwapPoolMobileFormProps = UseAddLiquidityFormReturns

export default function PancakeSwapPoolMobileForm(
  props: PancakeSwapPoolMobileFormProps
) {
  const {
    assets,
    activeField,
    maxBalances,
    optimizeDisabled,
    optimized,
    optimize,
    resetFields,
    setActiveField,
    setFocusedElement,
    focusedElement,
  } = props

  const tx = useAtomValue(addLiquidityAtom)

  useUnmount(() => {
    resetFields()
    setFocusedElement(null)
    setActiveField(null)
  })

  return (
    <StyledPancakeSwapPoolMobileForm>
      <header className="formHeader">
        <SlippageControl disabled={!!tx.hash} />

        <div className="buttonGroup">
          <Button
            className="optimizeButton"
            onClick={optimize}
            disabled={optimized}
            $contain
            $size="sm"
          >
            Optimize{optimized ? 'd' : ''}
          </Button>
        </div>
      </header>

      <div>
        <UnoptimizableAlert
          activeField={activeField as 'TokenA' | 'TokenB' | null}
          assets={assets}
          maxBalances={maxBalances}
          focusedElement={focusedElement}
          optimizeDisabled={optimizeDisabled}
        />

        <Fieldset {...props} />
      </div>
    </StyledPancakeSwapPoolMobileForm>
  )
}
