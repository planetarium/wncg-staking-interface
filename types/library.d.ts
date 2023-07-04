type Abi = import('abitype').Abi

type AbiFunction = import('abitype').AbiFunction

type AbiError = import('abitype').AbiError

type AbiEvent = import('abitype').AbiEvent

type AbiStateMutability = import('abitype').AbiStateMutability

type BigNumber = import('bignumber.js').BigNumber

type Chain = import('wagmi').Chain

type Ethereum = import('wagmi').WindowProvider
type WindowProvider = import('wagmi').WindowProvider

type RoundingMode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

type Overrides = import('ethers').Overrides & {
  gasLimit?: ResolvedConfig['BigIntType']
  gasPrice?: ResolvedConfig['BigIntType']
  maxFeePerGas?: ResolvedConfig['BigIntType']
  maxPriorityFeePerGas?: ResolvedConfig['BigIntType']
  nonce?: ResolvedConfig['IntType']
}

type PayableOverrides = Overrides & {
  value?: ResolvedConfig['IntType'] | ResolvedConfig['BigIntType']
}

type PayableAbi = {
  stateMutability: 'payable'
}

type NonPayableAbi = {
  stateMutability: 'nonpayable'
}

type TransactionReceipt =
  import('@ethersproject/abstract-provider').TransactionReceipt

type ConnectArgs = import('@wagmi/core').ConnectArgs

type FetchBalanceResult = import('@wagmi/core').FetchBalanceResult

type SendTransactionResult = import('@wagmi/core').SendTransactionResult

type WriteContractArgs = import('@wagmi/core').WriteContractArgs

type ReactHookFormChangeEvent<T> = {
  target: {
    name: T
    value: string
  }
  type: 'change'
}

type ControllerRenderProps = import('react-hook-form').ControllerRenderProps
type ControllerFieldState = import('react-hook-form').ControllerFieldState
type UseFormStateReturn<T> = import('react-hook-form').UseFormStateReturn<T>

type ControlRendererProps<T> = {
  field: ControllerRenderProps
  fieldState: ControllerFieldState
  formState: UseFormStateReturn<T>
}

type UseFetchOptions = {
  enabled?: boolean
  refetchInterval?: number
  refetchOnWindowFocus?: 'always'
  suspense?: boolean
}

type RpcUrls = {
  http: readonly string[]
  webSocket?: readonly string[]
}
