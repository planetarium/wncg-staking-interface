import { AnimatePresence } from 'framer-motion'

import type { UseExitFormReturns } from '../useExitForm'

import { StyledExitModalPage1 } from './styled'
import Footer from './Footer'
import Header from './Header'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

type ExitModalPage1Props = {
  currentPage: number
  send(value: string): void
} & UseExitFormReturns

function ExitModalPage1(props: ExitModalPage1Props) {
  const {
    bptIn,
    bptOutPcnt,
    clearErrors,
    control,
    currentPage,
    exitType,
    errors,
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
              bptIn={bptIn}
              errors={errors}
              exitType={exitType}
              priceImpact={priceImpact}
              priceImpactAgreement={priceImpactAgreement}
              send={send}
              tokenOutAmount={tokenOutAmount}
              totalValue={totalExitAmountsInFiatValue}
            />
          </div>
        </StyledExitModalPage1>
      )}
    </AnimatePresence>
  )
}

export default ExitModalPage1
