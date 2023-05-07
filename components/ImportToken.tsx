import { useCallback, useMemo } from 'react'

import { ConnectorId } from 'config/constants'
import { useAuth } from 'hooks'

import { StyledImportToken } from './styled'
import ConnectorIcon from './ConnectorIcon'

type ImportTokenProps = {
  address: Hash
  decimals: number
  symbol: string
  className?: string
  name?: string
  $variant?: ButtonVariant
  $size?: ButtonSize
  $contain?: boolean
}

export default function ImportToken({
  address,
  decimals,
  symbol,
  name = symbol,
  className,
  $variant = 'tertiary',
  $size = 'md',
  $contain = false,
}: ImportTokenProps) {
  const { connector, isConnected } = useAuth()

  const canImportToken = useMemo(() => {
    if (typeof window === 'undefined') return false
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
  }, [connector?.id])

  const importToken = useCallback(async () => {
    if (!canImportToken) return

    try {
      await (window.ethereum as Ethereum).request({
        method: 'wallet_watchAsset' as any,
        params: {
          type: 'ERC20',
          options: {
            address,
            decimals,
            name,
            symbol,
          },
        } as any,
      })
    } catch (error) {
      console.log(error)
    }
  }, [address, canImportToken, decimals, name, symbol])

  if (!canImportToken || !isConnected) return null

  const iconSize = $size === 'sm' ? 16 : 32

  return (
    <StyledImportToken
      className={className}
      onClick={importToken}
      $variant={$variant}
      $size={$size}
      $contain={$contain}
    >
      <span className="label">
        Import <strong>{name} token</strong>
      </span>

      <span className="rightIcon">
        <ConnectorIcon
          icon={connector!.id as ConnectorIconType}
          $size={iconSize}
        />
      </span>
    </StyledImportToken>
  )
}
