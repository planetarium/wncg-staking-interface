type TransactionResponse =
  import('@ethersproject/providers').TransactionResponse

declare type SendTransactionResult = {
  hash: TransactionResponse['hash']
  wait: TransactionResponse['wait']
}

declare type FetchBalanceResult = {
  decimals: number
  formatted: string
  symbol: string
  value: BigNumber
}

declare type TransactionResponse = TransactionResponse

declare type WriteContractResult = SendTransactionResult

declare type Hash = `0x${string}`

declare type ContractWriteOption = {
  onConfirm?(hash?: Hash): void
  onError?(error: any): void
}
