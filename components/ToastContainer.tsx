import { useMemo } from 'react'
import {
  ToastContainer as ReactToastContainer,
  ToastContainerProps,
} from 'react-toastify'
import { useRecoilValue } from 'recoil'

import { isDesktopState } from 'app/states/mediaQuery'

import { ToastCloseButton } from 'components/Toast/CloseButton'

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

export function ToastContainer() {
  const isDesktop = useRecoilValue(isDesktopState)
  const toastConfig = useMemo(
    () => (isDesktop ? config : { ...config, limit: 4 }),
    [isDesktop]
  )

  return <ReactToastContainer {...toastConfig} closeButton={ToastCloseButton} />
}
