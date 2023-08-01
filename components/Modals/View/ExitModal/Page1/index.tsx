import type { UseExitFormReturns } from 'hooks/balancer/useExitForm'

import { StyledExitModalPage1 } from './styled'
import { PendingNotice } from 'components/Modals/shared'
import Footer from './Footer'
import Header from './Header'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

type ExitModalPage1Props = {
  send: XstateSend
  hash?: Hash
} & UseExitFormReturns

function ExitModalPage1(props: ExitModalPage1Props & UseExitFormReturns) {
  const {
    assets,
    bptIn,
    clearErrors,
    control,
    isExactOut,
    exitAmounts,
    priceImpact,
    singleExitTokenOutIndex,
    singleExitMaxAmounts,
    totalExitFiatValue,
    submitDisabled,
    formState,
    watch,
    resetField,
    send,
    setValue,
    setMaxValue,
    hash,
    isPropExit,
    isNative,
  } = props

  return (
    <StyledExitModalPage1 $disabled={!!hash}>
      <Header disabled={!!hash} />

      <div className="container">
        <div className="modalContent">
          <Step1
            control={control}
            watch={watch}
            setValue={setValue}
            resetField={resetField}
            hash={hash}
          />

          <Step2
            assets={assets}
            clearErrors={clearErrors}
            control={control}
            watch={watch}
            exitAmounts={exitAmounts}
            setValue={setValue}
            setMaxValue={setMaxValue}
            singleExitMaxAmounts={singleExitMaxAmounts}
            singleExitTokenOutIndex={singleExitTokenOutIndex}
            totalExitFiatValue={totalExitFiatValue}
            hash={hash}
            isNative={isNative}
          />

          {!isPropExit && (
            <Step3
              priceImpact={priceImpact}
              setValue={setValue}
              watch={watch}
              hash={hash}
              formState={formState}
            />
          )}
        </div>
      </div>

      <Footer
        assets={assets}
        isExactOut={isExactOut}
        exitAmounts={exitAmounts}
        send={send}
        watch={watch}
        totalExitFiatValue={totalExitFiatValue}
        submitDisabled={submitDisabled}
        bptIn={bptIn}
      />

      <PendingNotice hash={hash} />
    </StyledExitModalPage1>
  )
}

export default ExitModalPage1
