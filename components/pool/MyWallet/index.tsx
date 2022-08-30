import { memo, MouseEvent, useMemo } from 'react'
import NumberFormat from 'react-number-format'
import clsx from 'clsx'
import styles from '../styles/Widget.module.scss'

import { configService } from 'services/config'
import { bnum } from 'utils/num'
import { getTokenInfo } from 'utils/token'
import { useBalances, usePoolService, useUsd } from 'hooks'

import MyWalletItem from './Item'

type MyWalletProps = {
  isNativeAsset?: boolean
  selectEth?(value: EthType): void
}

function MyWallet({ isNativeAsset, selectEth }: MyWalletProps) {
  const { balanceFor } = useBalances()
  const { poolService } = usePoolService()
  const { getFiatValue } = useUsd()

  const currentEthType: EthType = isNativeAsset ? 'eth' : 'weth'
  const isSelectable = !!selectEth

  const { poolTokenAddresses = [] } = poolService || {}

  const ercTokenAddresses = poolTokenAddresses.filter(
    (address) => address !== configService.weth
  )
  const etherAddresses = useMemo(
    () => [
      configService.nativeAssetAddress,
      ...poolTokenAddresses.filter((address) => address === configService.weth),
    ],
    [poolTokenAddresses]
  )

  const totalFiatValue = useMemo(() => {
    const addressesToSum = isSelectable
      ? [...ercTokenAddresses, etherAddresses[isNativeAsset ? 0 : 1]]
      : [...poolTokenAddresses, configService.nativeAssetAddress]
    const balances = addressesToSum.map((address) => balanceFor(address))
    const fiatValues = balances.map((balance, i) =>
      getFiatValue(addressesToSum[i], balance)
    )

    return fiatValues
      .reduce((total, value) => {
        return total.plus(value)
      }, bnum(0))
      .toNumber()
  }, [
    balanceFor,
    ercTokenAddresses,
    etherAddresses,
    getFiatValue,
    isNativeAsset,
    isSelectable,
    poolTokenAddresses,
  ])

  function handleSelectEthType(e: MouseEvent<HTMLDivElement>) {
    if (!isSelectable) return

    const dataset = e.currentTarget
      .dataset as typeof e.currentTarget.dataset & {
      ethType: EthType
    }
    selectEth(dataset.ethType)
  }

  return (
    <section className={styles.myBalance}>
      <h3 className={styles.title}>Pool tokens in my wallet</h3>
      <dl className={styles.details}>
        {ercTokenAddresses.map((address) => {
          const { symbol, name } = getTokenInfo(address)

          return (
            <MyWalletItem
              key={`myWalletErcToken.${address}`}
              address={address}
              name={name}
              symbol={symbol}
              balance={balanceFor(address)}
            />
          )
        })}

        <div className={clsx(styles.detailItem, styles.nested)}>
          <dt>
            <strong>Ether tokens</strong>
          </dt>
          <dd>
            <dl
              className={clsx(styles.ethList, {
                [styles.selectable]: isSelectable,
              })}
            >
              {etherAddresses.map((address) => {
                const { symbol, name } = getTokenInfo(address)
                const isSelected = symbol.toLowerCase() === currentEthType

                return (
                  <MyWalletItem
                    key={`myWalletEtherToken.${address}`}
                    address={address}
                    balance={balanceFor(address)}
                    name={name}
                    symbol={symbol}
                    isSelected={isSelected}
                    handleSelect={handleSelectEthType}
                  />
                )
              })}
            </dl>
          </dd>
        </div>

        <div className={styles.total}>
          <dt>Total</dt>
          <dd>
            <NumberFormat
              value={totalFiatValue}
              displayType="text"
              thousandSeparator
              decimalScale={2}
              prefix="$"
            />
          </dd>
        </div>
      </dl>
    </section>
  )
}

export default memo(MyWallet)
