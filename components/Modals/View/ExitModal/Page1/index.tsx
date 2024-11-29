import type { UseExitFormReturns } from 'hooks/balancer/useExitForm'

import { StyledExitModalPage1 } from './styled'
import { PendingNotice } from 'components/Modals/shared'
import Footer from './Footer'
import Header from './Header'
import Step1 from './Step1'
import Step2 from './Step2'

type ExitModalPage1Props = {
  send: XstateSend
  hash?: Hash
} & UseExitFormReturns

function ExitModalPage1(props: ExitModalPage1Props & UseExitFormReturns) {
  const { control, watch, send, setValue, hash, submitDisabled, amountIn } =
    props

  return (
    <StyledExitModalPage1 $disabled={!!hash}>
      <Header disabled={!!hash} />

      <div className="container">
        <div className="modalContent">
          <Step1 control={control} watch={watch} hash={hash} />

          <Step2
            control={control}
            watch={watch}
            setValue={setValue}
            hash={hash}
          />
        </div>
      </div>
      <Footer
        amountIn={amountIn}
        send={send}
        submitDisabled={submitDisabled}
        watch={watch}
      />
      <PendingNotice hash={hash} />
    </StyledExitModalPage1>
  )
}

export default ExitModalPage1
