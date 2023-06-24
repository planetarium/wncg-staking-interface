import { useAtomValue } from 'jotai'

import { joinTxAtom } from 'states/tx'
import type { UseAddLiquidityFormReturns } from 'hooks/pancakeswap/useAddLiquidityForm'

import { StyledPoolMobileForm } from './styled'
import Button from 'components/Button'
import Icon from 'components/Icon'
import {
  Fieldset,
  ProportionalGuideBanner,
  UnoptimizableAlert,
} from 'components/BalancerPool/shared'
import SlippageControl from 'components/SlippageControl'

type PoolMobileFormProps = UseAddLiquidityFormReturns

export default function PoolMobileForm(props: PoolMobileFormProps) {
  const {
    assets,
    formState,
    amountsIn,
    maxBalances,
    setValue,
    optimizeDisabled,
    optimized,
    optimize,
    resetFields,
    resetDisabled,
    focusedElement,
  } = props

  const tx = useAtomValue(joinTxAtom)

  return (
    <StyledPoolMobileForm>
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

          <button
            className="resetButton"
            type="reset"
            onClick={resetFields}
            disabled={resetDisabled}
            aria-label="Reset"
          >
            <Icon
              icon={resetDisabled ? 'refreshOff' : 'refreshOn'}
              $size={32}
            />
          </button>
        </div>
      </header>

      <div>
        <UnoptimizableAlert
          assets={assets}
          maxBalances={maxBalances}
          focusedElement={focusedElement}
          optimizeDisabled={optimizeDisabled}
        />

        <Fieldset {...props} />

        <ProportionalGuideBanner
          amountsIn={amountsIn}
          assets={assets}
          maxBalances={maxBalances}
          formState={formState}
          setValue={setValue}
        />
      </div>
    </StyledPoolMobileForm>
  )
}
