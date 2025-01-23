import Button from 'components/Button'
import Icon from 'components/Icon'
import { CloseButton } from 'components/Modals/shared'
import { StyledUnstakeModalPage1 } from './styled'

type UnstakeModalPage1Props = {
  send: XstateSend
}

function UnstakeModalPage1({ send }: UnstakeModalPage1Props) {
  function goNext() {
    send('NEXT')
  }

  return (
    <StyledUnstakeModalPage1>
      <header className="modalHeader">
        <div className="titleGroup">
          <h2 className="title accent">
            <Icon icon="time" $size={16} />
            Estimated earnings
          </h2>
          <h3 className="subtitle">
            Cooldown will be finished in 60 seconds. <br />
            You can withdraw after the cooldown.
          </h3>
        </div>

        <CloseButton />
      </header>

      <footer className="modalFooter">
        <div className="buttonGroup">
          <Button onClick={goNext} $variant="secondary" $size="md">
            Withdraw
          </Button>
        </div>
      </footer>
    </StyledUnstakeModalPage1>
  )
}

export default UnstakeModalPage1
