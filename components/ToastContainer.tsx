import { useEffect } from 'react'
import {
  ToastContainer as ReactToastContainer,
  ToastContainerProps,
  toast,
} from 'react-toastify'
import { useAtomValue } from 'jotai'

import { hasModalInViewAtom } from 'states/ui'

import CloseButton from './Toast/CloseButton'

const config: ToastContainerProps = {
  className: 'toastContainer',
  toastClassName: 'toast',
  bodyClassName: 'toastBody',
  progressClassName: 'progressBar',
  autoClose: false,
  closeButton: false,
  closeOnClick: true,
  draggable: true,
  limit: 3,
  pauseOnHover: true,
}

export default function ToastContainer() {
  const hasModalInView = useAtomValue(hasModalInViewAtom)

  useEffect(() => {
    if (hasModalInView) {
      toast.dismiss()
    }
  }, [hasModalInView])

  return <ReactToastContainer {...config} closeButton={CloseButton} />
}
