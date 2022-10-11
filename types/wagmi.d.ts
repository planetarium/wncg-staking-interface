declare type SendTransactionResult = {
  hash: providers.TransactionResponse['hash']
  wait: providers.TransactionResponse['wait']
}

declare type WriteContractResult = SendTransactionResult
