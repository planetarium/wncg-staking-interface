export type ChainMap<T> = {
  readonly [chainId in ChainId]: T
}
