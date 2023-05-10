import { useAtom } from 'jotai'

import { showOptimizeErrorAtom } from 'states/form'
import { useStaking } from 'hooks'
import type { UseJoinFormReturns } from 'hooks/useJoinForm'

import { StyledPoolMobileForm } from './styled'
import Button from 'components/Button'
import Icon from 'components/Icon'
import {
  Fieldset,
  ProportionalGuide,
  Unoptimizable,
} from 'components/Pool/shared'
import SlippageControl from 'components/SlippageControl'

type PoolMobileFormProps = UseJoinFormReturns

export default function PoolMobileForm(props: PoolMobileFormProps) {
  const {
    assets,
    formState,
    joinAmounts,
    maxBalances,
    setValue,
    optimizeDisabled,
    optimized,
    optimize,
    resetFields,
    resetDisabled,
  } = props

  const { stakedTokenAddress } = useStaking()
  const [showOptError, setShowOptError] = useAtom(showOptimizeErrorAtom)

  function handleOptimize() {
    optimize()
    setShowOptError(true)
  }

  function handleRefresh() {
    resetFields()
    setShowOptError(false)
  }

  return (
    <StyledPoolMobileForm>
      <header className="formHeader">
        <SlippageControl />

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
            onClick={handleRefresh}
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
        {optimizeDisabled && (
          <Unoptimizable
            assets={assets}
            maxBalances={maxBalances}
            showAlert={showOptError}
          />
        )}

        <Fieldset {...props} />

        <ProportionalGuide
          joinAmounts={joinAmounts}
          assets={assets}
          maxBalances={maxBalances}
          formState={formState}
          setValue={setValue}
        />
      </div>
    </StyledPoolMobileForm>
  )
}
