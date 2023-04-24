import { StyledExitModalPage1Header } from './styled'
import CloseButton from 'components/Modals/shared/CloseButton'
import SlippageControl from 'components/SlippageControl'

function ExitModalPage1Header() {
  return (
    <StyledExitModalPage1Header className="modalHeader">
      <div className="titleGroup">
        <h2 className="title accent">Exit pool</h2>
        <h3 className="subtitle">Exit pool</h3>
      </div>

      <SlippageControl />
      <CloseButton />
    </StyledExitModalPage1Header>
  )
}

export default ExitModalPage1Header
