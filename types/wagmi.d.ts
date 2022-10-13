declare namespace Wagmi {
  type TransactionResponse =
    import('@ethersproject/providers').TransactionResponse
}

declare type SendTransactionResult = {
  hash: Wagmi.TransactionResponse['hash']
  wait: Wagmi.TransactionResponse['wait']
}

declare type TransactionResponse = Wagmi.TransactionResponse

declare type WriteContractResult = SendTransactionResult

declare type Hash = `0x${string}`

declare type ContractWriteOption = {
  onConfirm?(hash?: Hash): void
  onError?(error: any): void
}
