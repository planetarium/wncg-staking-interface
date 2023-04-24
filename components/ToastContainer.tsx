import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import {
  ToastContainer as ReactToastContainer,
  ToastContainerProps,
} from 'react-toastify'

import { fromLaptopAtom } from 'states/screen'

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
  limit: 6,
  pauseOnHover: true,
}

export default function ToastContainer() {
  const fromLaptop = useAtomValue(fromLaptopAtom)

  const toastConfig = useMemo(
    () => (fromLaptop ? config : { ...config, limit: 4 }),
    [fromLaptop]
  )

  return <ReactToastContainer {...toastConfig} closeButton={CloseButton} />
}
