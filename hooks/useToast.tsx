import { toast } from 'react-toastify'
import { useSetRecoilState } from 'recoil'
import { nanoid } from 'nanoid'

import { toastIdListState } from 'app/states/toast'
import type { TxAction } from 'services/transaction'
import { toastAnimation } from 'utils/toast'

import { Toast } from 'components/Toast'
import { CustomToast } from 'components/Toast/CustomToast'

type AddCustomToast = {
  title: string
  message: string
  type?: ToastType
}

type SendToastParams = {
  action: TxAction
  title: string
  message: string
  hash?: string
  type?: ToastType
}

export function useToast() {
  const setToastIdList = useSetRecoilState(toastIdListState)

  function addCustomToast({ title, message, type }: AddCustomToast) {
    const toastId = `toast.${nanoid()}`
    toast(<CustomToast title={title} message={message} type={type} />, {
      transition: toastAnimation,
      toastId,
    })

    setToastIdList((prev) => [...prev, toastId])
  }

  const addTxToast = (params: SendToastParams) => {
    const toastId = `${params.hash || ''}.${nanoid()}`

    toast(<Toast {...params} />, {
      transition: toastAnimation,
      toastId,
    })

    setToastIdList((prev) => [...prev, toastId])
  }

  return {
    addCustomToast,
    addTxToast,
  }
}
