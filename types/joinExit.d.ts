type PoolActionType = 'Join' | 'Exit'

type JoinExit = {
  id: string
  type: PoolActionType
  sender: string
  amounts: string[]
  timestamp: number
  tx: string
}

type JoinPoolRequest = {
  assets: string[]
  maxAmountsIn: string[]
  userData: string
  fromInternalBalance: boolean
}
