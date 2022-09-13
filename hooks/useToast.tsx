import { cssTransition, toast } from 'react-toastify'
import { useSetRecoilState } from 'recoil'
import { nanoid } from 'nanoid'

import { toastIdListState } from 'app/states/toast'

import { Toast } from 'components/Toast'

const toastAnimation = cssTransition({
  enter: 'fadeIn',
  exit: 'fadeOut',
})

type AddToast = {
  title: string
  message: string
  type?: ToastType
}

export function useToast() {
  const setToastIdList = useSetRecoilState(toastIdListState)

  function addToast({ title, message, type }: AddToast) {
    const toastId = `toast.${nanoid()}`
    toast(<Toast id={toastId} title={title} message={message} type={type} />, {
      transition: toastAnimation,
      toastId,
    })

    setToastIdList((prev) => [...prev, toastId])
  }

  return {
    addToast,
  }
}
