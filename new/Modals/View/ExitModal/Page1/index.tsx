import type { StateValue } from 'xstate'
import { AnimatePresence } from 'framer-motion'

import type { UseExitFormReturns } from '../useExitForm'

import { ModalPage, PendingNotice } from 'new/Modals/shared'
import Footer from './Footer'
import Header from './Header'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

type ExitModalPage1Props = {
  currentPage: number
  currentState: StateValue
  send(value: string): void
  hash?: Hash
}

function ExitModalPage1(props: ExitModalPage1Props & UseExitFormReturns) {
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
    hash,
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

  const isPending = currentState === 'exitPending'

  return (
    <AnimatePresence>
      {currentPage === 1 && (
        <ModalPage>
          <Header disabled={isPending} />
          <div className="container">
            <Step1
              control={control}
              exitType={exitType}
              resetInputs={resetInputs}
              disabled={isPending}
            />
            <Step2
              bptOutPcnt={bptOutPcnt}
              clearErrors={clearErrors}
              control={control}
              exitType={exitType}
              setMaxValue={setMaxValue}
              singleExitMaxAmounts={singleExitMaxAmounts}
              singleExitTokenOutIndex={singleExitTokenOutIndex}
              disabled={isPending}
            />
            <Step3
              priceImpact={priceImpact}
              priceImpactAgreement={priceImpactAgreement}
              togglePriceImpactAgreement={togglePriceImpactAgreement}
              disabled={isPending}
            />
            <Footer
              assets={assets}
              bptIn={bptIn}
              bptOutPcnt={bptOutPcnt}
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
          </div>
          <PendingNotice hash={hash} />
        </ModalPage>
      )}
    </AnimatePresence>
  )
}

export default ExitModalPage1
