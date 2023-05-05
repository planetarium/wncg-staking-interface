import {
  ToastContainer as ReactToastContainer,
  ToastContainerProps,
} from 'react-toastify'

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
  return <ReactToastContainer {...config} closeButton={CloseButton} />
}
