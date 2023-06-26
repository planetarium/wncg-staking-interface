import { useCallback } from 'react'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'

import { approveTxAtom } from 'states/tx'
import { ModalType } from 'config/constants'
import { wait } from 'utils/wait'
import { useModal } from 'hooks'

import { StyledApprovalModalPage2 } from './styled'
import Button from 'components/Button'
import TokenIcon from 'components/TokenIcon'

type ApproveModalPage2Props = {
  buttonLabel: string
  tokenAddress: Hash
  tokenSymbol: string
  nextAction: ApproveNextAction
  send(event: string): void
}

export default function ApproveModalPage2({
  buttonLabel,
  tokenAddress,
  tokenSymbol,
  nextAction,
  send,
}: ApproveModalPage2Props) {
  const { addModal, updateModal } = useModal()

  const setTx = useSetAtom(approveTxAtom)

  const onNext = useCallback(async () => {
    if (nextAction.type !== ModalType.Approve) {
      setTx(RESET)
      await wait(0)
      addModal(nextAction)
      return
    }

    send('ROLLBACK')
    setTx(RESET)
    await wait(0)
    updateModal(nextAction)
  }, [addModal, nextAction, send, setTx, updateModal])

  return (
    <StyledApprovalModalPage2>
      <header className="modalHeader">
        <div className="tokenSymbol">
          <TokenIcon address={tokenAddress} $size={16} />
          {tokenSymbol}
        </div>

        <h2 className="title">Approval completed!</h2>
      </header>

      <footer className="modalFooter">
        <Button type="button" onClick={onNext} $size="md">
          {buttonLabel}
        </Button>
      </footer>
    </StyledApprovalModalPage2>
  )
}
