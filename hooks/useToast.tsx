import { cssTransition, toast } from 'react-toastify'

import Suspense from 'components/Suspense'
import Toast from 'components/Toast'

const toastAnimation = cssTransition({
  enter: 'toastIn',
  exit: 'toastOut',
})

export function useToast() {
  function addToast<T>(params: Toast<T>) {
    const { props } = params

    toast(
      <Suspense>
        <Toast {...params} />
      </Suspense>,
      {
        transition: toastAnimation,
        toastId: `toast:${props.hash}`,
      }
    )
  }

  return addToast
}
