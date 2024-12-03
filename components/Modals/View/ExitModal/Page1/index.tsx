import type { UseExitFormReturns } from 'hooks/balancer/useExitForm'

import { PendingNotice } from 'components/Modals/shared'
import Footer from './Footer'
import Header from './Header'
import Step1 from './Step1'
import Step2 from './Step2'
import { StyledExitModalPage1 } from './styled'

type ExitModalPage1Props = {
  send: XstateSend
  hash?: Hash
} & UseExitFormReturns

function ExitModalPage1(props: ExitModalPage1Props & UseExitFormReturns) {
  const {
    control,
    watch,
    send,
    setValue,
    hash,
    submitDisabled,
    amountIn,
    totalExitFiatValue,
    receiveAmounts,
  } = props

  return (
    <StyledExitModalPage1 $disabled={!!hash}>
      <Header disabled={!!hash} />

      <div className="container">
        <div className="modalContent">
          <Step1 control={control} watch={watch} hash={hash} />
          <Step2
            amountIn={amountIn}
            totalExitFiatValue={totalExitFiatValue}
            receiveAmounts={receiveAmounts}
            control={control}
            watch={watch}
            setValue={setValue}
            hash={hash}
          />
        </div>
      </div>
      <Footer
        amountIn={amountIn}
        totalExitFiatValue={totalExitFiatValue}
        send={send}
        submitDisabled={submitDisabled}
        watch={watch}
      />
      <PendingNotice hash={hash} />
    </StyledExitModalPage1>
  )
}

export default ExitModalPage1
