import { MouseEvent, useCallback, useMemo } from 'react'

import config from 'config'
import { ConnectorId } from 'config/constants'
import { isEthereum } from 'utils/isEthereum'
import { useAuth, useChain, useStaking } from 'hooks'

import { StyledImportToken } from './styled'
import ConnectorIcon from './ConnectorIcon'

type ImportTokenProps = {
  address: Hash
  className?: string
  name?: string
  $variant?: ButtonVariant
  $size?: ButtonSize
  $contain?: boolean
}

export default function ImportToken({
  address,
  name,
  className,
  $variant = 'tertiary',
  $size = 'md',
  $contain = false,
}: ImportTokenProps) {
  const { connector, isConnected } = useAuth()
  const { chainId } = useChain()
  const { lpToken, tokens } = useStaking()

  const importOptions = useMemo(() => {
    if (address === lpToken.address) {
      const { totalSupply, ...rest } = lpToken
      return rest
    }

    return {
      ...tokens[address],
      name: tokens[address].symbol,
    }
  }, [address, lpToken, tokens])

  const labelSymbol = useMemo(
    () =>
      address === lpToken.address && isEthereum(chainId)
        ? importOptions.name
        : importOptions.symbol,
    [
      address,
      chainId,
      importOptions.name,
      importOptions.symbol,
      lpToken.address,
    ]
  )

  const importDisabled = useMemo(() => {
    if (typeof window === 'undefined') return false
    if (address.toLowerCase() === config.nativeCurrency.address) return false
    if (!isConnected) return false

    switch (true) {
      case window?.ethereum?.isMetaMask &&
        connector?.id === ConnectorId.MetaMask:
      case window?.ethereum?.isTrust &&
        connector?.id === ConnectorId.TrustWallet:
      case window?.ethereum?.isCoinbaseWallet &&
        connector?.id === ConnectorId.CoinbaseWallet:
        return true
      default:
        return false
    }
  }, [address, connector?.id, isConnected])

  const onImportToken = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      if (!importDisabled) return

      try {
        await (window.ethereum as Ethereum).request({
          method: 'wallet_watchAsset' as any,
          params: {
            type: 'ERC20',
            options: importOptions,
          },
        })
      } catch (error) {
        console.log(error)
      }
    },
    [importDisabled, importOptions]
  )

  if (!importDisabled) return null

  return (
    <StyledImportToken
      className={className}
      onClick={onImportToken}
      $variant={$variant}
      $size={$size}
      $contain={$contain}
    >
      <span className="label">
        Import <strong>{labelSymbol} token</strong>
      </span>

      <span className="rightIcon">
        <ConnectorIcon
          icon={connector!.id as ConnectorIconType}
          $size={$size === 'sm' ? 16 : 32}
        />
      </span>
    </StyledImportToken>
  )
}
