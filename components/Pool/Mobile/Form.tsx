import { useSetAtom } from 'jotai'

import { optimizeErrorAtom } from 'states/form'
import { useStaking } from 'hooks'
import type { UseJoinFormReturns } from 'hooks/useJoinForm'

import Button from 'components/Button'
import { StyledPoolMobileForm } from './styled'
import Icon from 'components/Icon'
import {
  Fieldset,
  ProportionalGuide,
  Unoptimizable,
} from 'components/Pool/shared'
import SlippageControl from 'components/SlippageControl'
import TokenIcon from 'components/TokenIcon'

type PoolMobileFormProps = UseJoinFormReturns

export default function PoolMobileForm(props: PoolMobileFormProps) {
  const {
    assets,
    formState,
    joinAmounts,
    maxBalances,
    setValue,
    showAlert,
    optimizeDisabled,
    optimized,
    optimize,
    resetFields,
    resetDisabled,
  } = props

  const { stakedTokenAddress } = useStaking()
  const setShowError = useSetAtom(optimizeErrorAtom)

  function handleOptimize() {
    optimize()
    setShowError(true)
  }

  return (
    <StyledPoolMobileForm>
      <header className="formHeader">
        <h3 className="title">
          <TokenIcon address={stakedTokenAddress} $size={24} />
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

        <SlippageControl />
      </header>

      {optimizeDisabled && (
        <Unoptimizable
          assets={assets}
          maxBalances={maxBalances}
          showAlert={showAlert}
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
    </StyledPoolMobileForm>
  )
}
