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
    bptIn,
    clearErrors,
    control,
    exitType,
    singleExitMaxAmounts,
    trigger,
    formState,
    watch,
    resetField,
    send,
    setValue,
    hash,
    isNative,
    submitDisabled,
    tokenOutIndex,
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
            singleExitMaxAmounts={singleExitMaxAmounts}
            clearErrors={clearErrors}
            control={control}
            watch={watch}
            setValue={setValue}
            trigger={trigger}
            hash={hash}
            isNative={isNative}
          />

          {exitType != null && (
            <Step3
              setValue={setValue}
              watch={watch}
              hash={hash}
              formState={formState}
              singleExitMaxAmounts={singleExitMaxAmounts}
              tokenOutIndex={tokenOutIndex}
            />
          )}
        </div>
      </div>

      <Footer
        bptIn={bptIn}
        send={send}
        singleExitMaxAmounts={singleExitMaxAmounts}
        submitDisabled={submitDisabled}
        tokenOutIndex={tokenOutIndex}
        watch={watch}
      />

      <PendingNotice hash={hash} />
    </StyledExitModalPage1>
  )
}

export default ExitModalPage1
