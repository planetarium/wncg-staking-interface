type PoolActionType = 'Join' | 'Exit'

type JoinExit = {
  id: string
  type: PoolActionType
  sender: string
  amounts: string[]
  timestamp: number
  tx: string
}
