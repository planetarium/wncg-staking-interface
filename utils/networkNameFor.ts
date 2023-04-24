import networkConfigs from 'config/networks'

export function networkNameFor(network: Network): string {
  return networkConfigs[network].shortName
}
