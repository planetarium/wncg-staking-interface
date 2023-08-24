import { useAtom } from 'jotai'

import { cooldownTxAtom } from 'states/tx'
import { walletErrorHandler } from 'utils/walletErrorHandler'
import { useCooldown } from './useCooldown'

import { StyledCooldownModalPage2 } from './styled'
import { CloseButton, PendingNotice } from 'components/Modals/shared'
import TxButton from 'components/TxButton'
import BarGraph from './BarGraph'
import Guide from './Guide'
import Summary from './Summary'

type CooldownModalPage2Props = {
  send: XstateSend
}

function CooldownModalPage2({ send }: CooldownModalPage2Props) {
  const _cooldown = useCooldown()

  const [tx, setTx] = useAtom(cooldownTxAtom)

  async function cooldown() {
    try {
      if (!_cooldown) {
        throw Error('No writeAsync')
      }

      const txHash = await _cooldown()
      if (!txHash) throw Error('No txHash')

      setTx({ hash: txHash })
      send('NEXT')
    } catch (error: any) {
      walletErrorHandler(error, () => send('FAIL'))
      send('ROLLBACK')
    }
  }

  return (
    <StyledCooldownModalPage2 $disabled={!!tx.hash}>
      <header className="modalHeader">
        <div className="titleGroup">
          <h2 className="title accent">Cooldown</h2>
          <h3 className="subtitle">
            You&apos;ll get more rewards if you stay. Do you really want to
            start cooldown?
          </h3>
        </div>

        <CloseButton />
      </header>

      <div className="container">
        <div className="modalContent">
          <BarGraph />
          <Guide />
        </div>
      </div>

      <footer className="modalFooter">
        <Summary />

        <TxButton onClick={cooldown} hash={tx.hash}>
          Start cooldown
        </TxButton>
      </footer>

      <PendingNotice hash={tx.hash} />
    </StyledCooldownModalPage2>
  )
}

export default CooldownModalPage2
