import { atom, selector } from 'recoil'

export const toastIdListState = atom<string[]>({
  key: '#toastIdList',
  default: [],
})

export const latestToastIdState = selector<string | null>({
  key: '#latestToastId',
  get({ get }) {
    const list = get(toastIdListState)
    if (!list.length) return null
    return list[list.length - 1]
  },
})
