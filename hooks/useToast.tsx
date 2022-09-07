import { toast } from 'react-toastify'
import { useSetRecoilState } from 'recoil'
import { nanoid } from 'nanoid'

import { toastIdListState } from 'app/states/toast'
import type { TxAction } from 'services/transaction'
import { toastAnimation } from 'utils/toast'

import { TxToast } from 'components/Toast/TxToast'
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
    toast(
      <CustomToast id={toastId} title={title} message={message} type={type} />,
      {
        transition: toastAnimation,
        toastId,
      }
    )

    setToastIdList((prev) => [...prev, toastId])
  }

  function addErrorToast({ title, message }: Omit<AddCustomToast, 'type'>) {
    addCustomToast({ title, message, type: 'error' })
  }

  const addTxToast = (params: SendToastParams) => {
    const toastId = `${params.hash || ''}.${nanoid()}`

    toast(<TxToast id={toastId} {...params} />, {
      transition: toastAnimation,
      toastId,
    })

    setToastIdList((prev) => [...prev, toastId])
  }

  return {
    addCustomToast,
    addErrorToast,
    addTxToast,
  }
}
