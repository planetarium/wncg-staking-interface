import { cssTransition, toast } from 'react-toastify'
import { useSetRecoilState } from 'recoil'
import { nanoid } from 'nanoid'

import { toastIdListState } from 'app/states/toast'

import { Toast } from 'components/Toast'
import { configService } from 'services/config'

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
  const setToastIdList = useSetRecoilState(toastIdListState)

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

function getTokensToImport(
  title: string,
  type?: ToastType
): string[] | undefined {
  if (type !== 'success') return

  title = title.toLowerCase()

  if (title.includes('wncg')) {
    return [configService.rewardTokensList[0]]
  }

  if (title.includes('bal')) {
    return [configService.rewardTokensList[1]]
  }

  if (title.includes('claim all')) {
    return configService.rewardTokensList
  }
}
