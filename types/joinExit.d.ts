type InvestType = 'Join' | 'Exit'

type JoinExit = {
  id: string
  type: InvestType
  sender: string
  amounts: string[]
  timestamp: number
  tx: string
}
