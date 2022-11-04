import { useMemo } from 'react'
import {
  ToastContainer as ReactToastContainer,
  ToastContainerProps,
} from 'react-toastify'

import { isDesktopAtom } from 'states/ui'
import {
  MAX_TOAST_LENGTH_DESKTOP,
  MAX_TOAST_LENGTH_MOBILE,
} from 'constants/toast'

import type { MouseEvent } from 'react'
import type { CloseButtonProps } from 'react-toastify'
import { useAtomValue } from 'jotai'

import { isMobileAtom } from 'states/ui'

import SvgIcon from 'components/SvgIcon'

export function ToastCloseButton({ closeToast }: CloseButtonProps) {
  const isMobile = useAtomValue(isMobileAtom)

  if (isMobile) {
    return null
  }

  function close(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    closeToast(e)
  }

  return (
    <button type="button" onClick={close}>
      <SvgIcon icon="close" />
    </button>
  )
}

const config: ToastContainerProps = {
  className: 'toastContainer',
  toastClassName: 'toast',
  bodyClassName: 'toastBody',
  progressClassName: 'progressBar',
  hideProgressBar: true,
  autoClose: false,
  closeButton: false,
  closeOnClick: true,
  draggable: true,
  limit: MAX_TOAST_LENGTH_DESKTOP,
  pauseOnHover: true,
}

export function ToastContainer() {
  const isDesktop = useAtomValue(isDesktopAtom)

  const toastConfig = useMemo(() => {
    return isDesktop
      ? config
      : { ...config, limit: MAX_TOAST_LENGTH_MOBILE, autoClose: 5000 }
  }, [isDesktop])

  return <ReactToastContainer {...toastConfig} closeButton={ToastCloseButton} />
}
