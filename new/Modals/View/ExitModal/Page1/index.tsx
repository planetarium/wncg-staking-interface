import { useAtomValue } from 'jotai'
import type { StateValue } from 'xstate'
import { AnimatePresence } from 'framer-motion'

import { pendingExitTxAtom } from 'states/form'
import type { UseExitFormReturns } from '../useExitForm'

import { StyledExitModalPage1 } from './styled'
import { PendingNotice } from 'new/Modals/shared'
import Footer from './Footer'
import Header from './Header'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

type ExitModalPage1Props = {
  currentPage: number
  currentState: StateValue
  send(value: string): void
} & UseExitFormReturns

function ExitModalPage1(props: ExitModalPage1Props) {
  const {
    assets,
    bptIn,
    bptOutPcnt,
    clearErrors,
    control,
    currentPage,
    currentState,
    errors,
    exactOut,
    exitAmounts,
    exitType,
    isProportional,
    priceImpact,
    priceImpactAgreement,
    resetInputs,
    send,
    setMaxValue,
    singleExitMaxAmounts,
    singleExitTokenOutIndex,
    togglePriceImpactAgreement,
    tokenOutAmount,
    totalExitAmountsInFiatValue,
  } = props

  const { hash } = useAtomValue(pendingExitTxAtom)

  return (
    <AnimatePresence>
      {currentPage === 1 && (
        <StyledExitModalPage1>
          <Header />
          <div className="container">
            <Step1
              control={control}
              exitType={exitType}
              resetInputs={resetInputs}
            />
            <Step2
              bptOutPcnt={bptOutPcnt}
              clearErrors={clearErrors}
              control={control}
              exitType={exitType}
              setMaxValue={setMaxValue}
              singleExitMaxAmounts={singleExitMaxAmounts}
              singleExitTokenOutIndex={singleExitTokenOutIndex}
            />
            <Step3
              priceImpact={priceImpact}
              priceImpactAgreement={priceImpactAgreement}
              togglePriceImpactAgreement={togglePriceImpactAgreement}
            />
            <Footer
              assets={assets}
              bptIn={bptIn}
              currentState={currentState}
              errors={errors}
              exactOut={exactOut}
              exitAmounts={exitAmounts}
              exitType={exitType}
              isProportional={isProportional}
              priceImpact={priceImpact}
              priceImpactAgreement={priceImpactAgreement}
              send={send}
              tokenOutAmount={tokenOutAmount}
              totalValue={totalExitAmountsInFiatValue}
            />

            <PendingNotice hash={hash} />
          </div>
        </StyledExitModalPage1>
      )}
    </AnimatePresence>
  )
}

export default ExitModalPage1
