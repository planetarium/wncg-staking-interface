import { atom } from 'recoil'

export const toastIdListState = atom<string[]>({
  key: '#toastIdList',
  default: [],
})
