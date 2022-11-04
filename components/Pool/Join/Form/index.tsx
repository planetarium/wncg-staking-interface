import { memo, useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import { AnimatePresence } from 'framer-motion'

import { optimizeErrorAtom } from 'states/form'
import { fadeIn } from 'constants/motionVariants'
import { useAccount } from 'hooks'
import { useJoinForm } from './useJoinForm'

import { StyledJoinForm } from './styled'
import RektPriceImpact from 'components/RektPriceImpact'
import HighPriceImpact from 'components/HighPriceImpact'
import Footer from './Footer'
import Header from './Header'
import InputField from './InputField'
import NotOptimizable from './NotOptimizable'
import ProportionalGuide from './ProportionalGuide'
import Summary from './Summary'

function JoinForm() {
  const { account, isConnected } = useAccount()
  const {
    assets,
    balances,
    balancesInFiatValue,
    control,
    currentEtherType,
    emptyBalances,
    ethWarning,
    fieldList,
    errors,
    joinAmounts,
    optimize,
    optimized,
    poolTokenAddresses,
    poolTokenDecimals,
    priceImpact,
    priceImpactAgreement,
    resetDisabled,
    resetForm,
    rules,
    selectEther,
    setMaxValue,
    togglePriceImpactAgreement,
    totalJoinAmountsInFiatValue,
    updateValue,
    weights,
  } = useJoinForm()

  const setOptimizeError = useSetAtom(optimizeErrorAtom)

  useEffect(() => {
    resetForm()
    setOptimizeError(RESET)
  }, [account, resetForm, setOptimizeError])

  return (
    <AnimatePresence>
      {isConnected && (
        <StyledJoinForm
          className="joinForm"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeIn}
        >
          <Header
            optimize={optimize}
            optimized={optimized}
            resetDisabled={resetDisabled}
            reset={resetForm}
          />

          <NotOptimizable assets={assets} emptyBalances={emptyBalances} />

          <div className="joinFormControl">
            {fieldList.map((field, i) => {
              return (
                <InputField
                  key={`joinForm:${field}`}
                  name={field}
                  address={poolTokenAddresses[i]}
                  control={control}
                  currentEtherType={currentEtherType}
                  decimals={poolTokenDecimals[i]}
                  disabled={emptyBalances[i]}
                  maxAmount={balances[i]}
                  maxAmountInFiatValue={balancesInFiatValue[i]}
                  rules={rules[i]}
                  selectEther={selectEther}
                  setMaxValue={setMaxValue}
                  warning={ethWarning}
                  weight={weights[i]}
                />
              )
            })}
          </div>

          <ProportionalGuide
            amounts={joinAmounts}
            assets={assets}
            balances={balances}
            fieldList={fieldList}
            errors={errors}
            updateValue={updateValue}
          />

          <Summary
            priceImpact={priceImpact}
            totalValue={totalJoinAmountsInFiatValue}
          />

          <HighPriceImpact
            checked={priceImpactAgreement}
            priceImpact={priceImpact}
            toggle={togglePriceImpactAgreement}
          />
          <RektPriceImpact action="join" priceImpact={priceImpact} />

          <Footer
            amounts={joinAmounts}
            assets={assets}
            errors={errors}
            priceImpact={priceImpact}
            priceImpactAgreement={priceImpactAgreement}
            resetForm={resetForm}
            totalValue={totalJoinAmountsInFiatValue}
          />
        </StyledJoinForm>
      )}
    </AnimatePresence>
  )
}

export default memo(JoinForm)
