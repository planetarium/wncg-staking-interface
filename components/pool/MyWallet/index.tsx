import { memo, MouseEvent, useMemo } from 'react'
import clsx from 'clsx'
import styles from '../styles/Widget.module.scss'

import { configService } from 'services/config'
import { uniqAddress } from 'utils/address'
import { usdCountUpOption } from 'utils/countUp'
import { bnum } from 'utils/num'
import { useBalances, usePool, useFiatCurrency } from 'hooks'

import { CountUp } from 'components/CountUp'
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

    return (
      fiatValues
        .reduce((total, value) => {
          return total.plus(value)
        }, bnum(0))
        .toFixed(2) || '0'
    )
  }, [
    isSelectable,
    ercTokenAddresses,
    etherAddresses,
    currentEther,
    poolTokenAddresses,
    balanceFor,
    toFiat,
  ])

  function handleSelectEther(e: MouseEvent<HTMLDivElement>) {
    if (!isSelectable) return

    const dataset = e.currentTarget
      .dataset as typeof e.currentTarget.dataset & {
      currentEther: string
    }

    selectEther(dataset.currentEther)
  }

  return (
    <section className={styles.widget}>
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
                [styles.weth]: currentEther === etherAddresses[1],
              })}
            >
              {etherAddresses.map((address) => (
                <MyWalletItem
                  key={`myWalletEtherToken.${address}`}
                  address={address}
                  balance={balanceFor(address)}
                  isSelected={address === currentEther}
                  handleSelect={handleSelectEther}
                />
              ))}
            </dl>
          </dd>
        </div>

        <div className={styles.total}>
          <dt>Total</dt>
          <dd>
            <CountUp
              {...usdCountUpOption}
              className={styles.usd}
              end={totalFiatValue}
            />
          </dd>
        </div>
      </dl>
    </section>
  )
}

export default memo(MyWallet)
