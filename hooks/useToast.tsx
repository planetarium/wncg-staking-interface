import { cssTransition, toast } from 'react-toastify'
import { useSetAtom } from 'jotai'
import { nanoid } from 'nanoid'

import { toastIdsAtom } from 'states/ui'
import { configService } from 'services/config'

import { Toast } from 'components/Toast'

const toastAnimation = cssTransition({
  enter: 'fadeIn',
  exit: 'fadeOut',
})

type AddToast = {
  title: string
  message: string
  hash?: string
  type?: ToastType
}

export function useToast() {
  const setToastIdList = useSetAtom(toastIdsAtom)

  function addToast(params: AddToast) {
    const toastId = `toast.${nanoid()}`
    const tokensToImport = getTokensToImport(params.title, params.type)

    toast(<Toast id={toastId} {...params} tokensToImport={tokensToImport} />, {
      transition: toastAnimation,
      toastId,
    })

    setToastIdList((prev) => [...prev, toastId])
  }

  return {
    addToast,
  }
}

// FIXME: Refactor
function getTokensToImport(
  title: string,
  type?: ToastType
): string[] | undefined {
  if (type !== 'success') return

  title = title.toLowerCase()

  if (title.includes('wncg')) {
    return ['']
  }

  if (title.includes('bal')) {
    return [configService.bal]
  }

  if (title.includes('claim all')) {
    return ['', configService.bal]
  }
}
