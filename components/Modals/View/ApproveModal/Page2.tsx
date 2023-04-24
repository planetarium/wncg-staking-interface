import { useCallback } from 'react'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'

import { approveTxAtom } from 'states/tx'
import { ModalType } from 'config/constants'
import { wait } from 'utils/wait'
import { useModal } from 'hooks'

import Button from 'components/Button'
import { CompletePage } from 'components/Modals/shared'

type ApproveModalPage2Props = {
  buttonLabel: string
  tokenSymbol: string
  nextAction: ApproveNextAction
  send(event: string): void
}

export default function ApproveModalPage2({
  buttonLabel,
  tokenSymbol,
  nextAction,
  send,
}: ApproveModalPage2Props) {
  const { addModal, updateModal, removeModal } = useModal()

  const setTx = useSetAtom(approveTxAtom)

  const onNext = useCallback(async () => {
    if (nextAction.type !== ModalType.Approve) {
      removeModal()
      setTx(RESET)
      await wait(0)
      addModal(nextAction)
      return
    }

    send('ROLLBACK')
    setTx(RESET)
    await wait(0)
    updateModal(nextAction)
  }, [addModal, nextAction, removeModal, send, setTx, updateModal])

  return (
    <CompletePage>
      <header className="modalHeader">
        <h2 className="title">
          {tokenSymbol}
          <br />
          Approval completed!
        </h2>
      </header>

      <footer className="modalFooter">
        <Button type="button" onClick={onNext} $size="md">
          {buttonLabel}
        </Button>
      </footer>
    </CompletePage>
  )
}
