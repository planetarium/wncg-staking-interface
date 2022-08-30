import { toast } from 'react-toastify'
import { nanoid } from 'nanoid'

import { addToast as addToastId } from 'app/states/toast'
import type { TransactionAction } from 'services/transaction'
import { toastAnimation } from 'utils/toast'
import { useAppDispatch } from './useRedux'

import { Toast } from 'components/Toast'

type AddToastParams = {
  action: TransactionAction
  hash: string
  title: string
  message: string
  type?: ToastType
}

export function useToast() {
  const dispatch = useAppDispatch()

  function addToast(
    params: AddToastParams,
    confirmationHash?: string,
    data?: any
  ) {
    const toastId = `${params.hash}.${nanoid()}`

    toast(<Toast {...params} />, {
      transition: toastAnimation,
      toastId,
    })

    dispatch(addToastId(toastId))

    // if (confirmationHash) {
    //   registerConfirmations(confirmationHash, data)
    // }
  }

  const sendToast = (params: AddToastParams) => {
    const toastId = `${params.hash}.${nanoid()}`

    toast(<Toast {...params} />, {
      transition: toastAnimation,
      toastId,
    })

    return toastId
  }

  return {
    addToast,
    sendToast,
  }
}
