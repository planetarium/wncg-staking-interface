type Transaction = {
  action: TxAction
  hash: string
  status: TxStatus
  addedTime: number
  finalizedTime?: number
  params?: string | string[]
}
