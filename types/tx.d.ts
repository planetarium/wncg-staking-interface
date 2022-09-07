type Transaction = {
  action: TxAction
  hash: string
  status: TxStatus
  addedTime: number
  finalizedTime?: number
  error?: any
  params?: string | string[]
}
