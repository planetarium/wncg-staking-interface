import { memo, MouseEvent, useMemo } from 'react'
import NumberFormat from 'react-number-format'
import { isSameAddress } from '@balancer-labs/sdk'
import clsx from 'clsx'
import styles from '../styles/Widget.module.scss'

import { configService } from 'services/config'
import { uniqAddress } from 'utils/address'
import { bnum } from 'utils/num'
import { useBalances, usePool, useFiatCurrency } from 'hooks'

import MyWalletItem from './Item'

type MyWalletProps = {
  currentEther?: string
  selectEther?(value: string): void
}

function MyWallet({ currentEther, selectEther }: MyWalletProps) {
  const { balanceFor } = useBalances()
  const { nativeAssetIndex, poolTokenAddresses } = usePool()
  const { toFiat } = useFiatCurrency()

  const isSelectable = !!currentEther && !!selectEther

  const ercTokenAddresses = poolTokenAddresses.filter(
    (address) => address !== configService.weth
  )
  const etherAddresses = useMemo(
    () =>
      uniqAddress([
        configService.nativeAssetAddress,
        poolTokenAddresses[nativeAssetIndex],
      ]),
    [nativeAssetIndex, poolTokenAddresses]
  )

  const totalFiatValue = useMemo(() => {
    const addressesToSum = isSelectable
      ? [
          ...ercTokenAddresses,
          etherAddresses[etherAddresses.indexOf(currentEther)],
        ]
      : [...poolTokenAddresses, configService.nativeAssetAddress]

    const balances = addressesToSum.map((address) => balanceFor(address))
    const fiatValues = balances.map((balance, i) =>
      toFiat(addressesToSum[i], balance)
    )

    return fiatValues
      .reduce((total, value) => {
        return total.plus(value)
      }, bnum(0))
      .toNumber()
  }, [
    isSelectable,
    ercTokenAddresses,
    etherAddresses,
    currentEther,
    poolTokenAddresses,
    balanceFor,
    toFiat,
  ])

  function handleSelectEthType(e: MouseEvent<HTMLDivElement>) {
    if (!isSelectable) return

    const dataset = e.currentTarget
      .dataset as typeof e.currentTarget.dataset & {
      currentEther: string
    }
    selectEther(dataset.currentEther)
  }

  return (
    <section className={styles.myBalance}>
      <h3 className={styles.title}>Pool tokens in my wallet</h3>
      <dl className={styles.details}>
        {ercTokenAddresses.map((address) => {
          return (
            <MyWalletItem
              key={`myWalletErcToken.${address}`}
              address={address}
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
                const isSelected = isSameAddress(address, currentEther!)

                return (
                  <MyWalletItem
                    key={`myWalletEtherToken.${address}`}
                    address={address}
                    balance={balanceFor(address)}
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
