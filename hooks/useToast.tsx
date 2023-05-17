import { cssTransition, toast } from 'react-toastify'

import Toast from 'components/Toast'
import Suspense from 'components/Suspense'

const toastAnimation = cssTransition({
  enter: 'fadeIn',
  exit: 'fadeOut',
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
