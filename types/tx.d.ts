type TxStatus = 'pending' | 'fulfilled' | 'error' | 'canceled'

type Tx = {
  addedTime: number
  data: string
  hash: string
  status: TxStatus
  toast: ToastContent
  transaction: Transaction
  error?: any
  finalizedTime?: number
}

type TxMap = {
  [id: string]: Tx
}

type TxError = {
  title: string
  message: string
}
