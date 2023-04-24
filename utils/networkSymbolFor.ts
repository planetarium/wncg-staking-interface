import networkConfigs from 'config/networks'

export function networkSymbolFor(network: Network): string {
  return networkConfigs[network].nativeCurrency.symbol
}
