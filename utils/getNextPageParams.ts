import { PAGE_PER } from 'config/misc'

export function getNextPageParam<T>(lastPage: T[], pages: T[][]) {
  return lastPage.length === PAGE_PER ? pages.length * PAGE_PER : false
}
