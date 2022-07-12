import { toast } from 'react-toastify'

import { addToast as addToastId } from 'app/states/toast'
import type { TransactionAction } from 'app/states/transaction'
import { toastAnimation } from 'utils/toast'
import { useConfirmations } from './useConfirmations'
import { useAppDispatch } from './useRedux'

import { Toast } from 'components/Toast'

type AddToastParams = {
  action: TransactionAction
  hash: string
  summary: string
  showPartyEmoji?: boolean
}

export function useToast() {
  const dispatch = useAppDispatch()
  const { registerConfirmations } = useConfirmations()

  function addToast(params: AddToastParams, confirmationHash?: string) {
    const { hash, summary } = params
    const toastId = `${hash}.${summary}`

    toast(<Toast {...params} />, {
      transition: toastAnimation,
      toastId,
    })
    dispatch(addToastId(toastId))

    if (confirmationHash) {
      registerConfirmations(confirmationHash)
    }
  }

  return {
    addToast,
  }
}
