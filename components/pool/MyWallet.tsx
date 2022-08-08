import { memo, MouseEvent, useMemo } from 'react'
import NumberFormat from 'react-number-format'
import clsx from 'clsx'
import styles from './styles/Widget.module.scss'

import {
  getEthBalance,
  getWethBalance,
  getWncgBalance,
} from 'app/states/balance'
import Decimal from 'utils/num'
import { useAppSelector, useUsd } from 'hooks'

const ethList: EthType[] = ['eth', 'weth']

type MyWalletProps = {
  currentEthType?: EthType
  selectEth?(value: EthType): void
}

function MyWallet({ currentEthType, selectEth }: MyWalletProps) {
  const { calculateUsdValue } = useUsd()

  const ethBalance = useAppSelector(getEthBalance)
  const wethBalance = useAppSelector(getWethBalance)
  const wncgBalance = useAppSelector(getWncgBalance)

  const ethUsdValue = calculateUsdValue('weth', ethBalance)
  const wethUsdValue = calculateUsdValue('weth', wethBalance)
  const wncgUsdValue = calculateUsdValue('wncg', wncgBalance)

  const isSelectable = !!selectEth
  const wncgBalanceAmount = new Decimal(wncgBalance)
  const isWncgLessThanMinAmount =
    !wncgBalanceAmount.isZero() && wncgBalanceAmount.lt(0.0001)

  const totalValue = useMemo(() => {
    if (!isSelectable) {
      return new Decimal(ethUsdValue)
        .add(wethUsdValue)
        .add(wncgUsdValue)
        .toNumber()
    }
    const balance = currentEthType === 'eth' ? ethUsdValue : wethUsdValue
    return new Decimal(wncgUsdValue).add(balance).toNumber()
  }, [currentEthType, ethUsdValue, isSelectable, wethUsdValue, wncgUsdValue])

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
        <div className={styles.detailItem}>
          <dt>
            <strong>WNCG</strong>
            <span>Wrapped NCG</span>
          </dt>
          <dd>
            {isWncgLessThanMinAmount ? (
              '< 0.0001'
            ) : (
              <NumberFormat
                value={wncgBalance}
                displayType="text"
                thousandSeparator
                decimalScale={4}
              />
            )}
            <NumberFormat
              className={styles.usd}
              value={wncgUsdValue}
              displayType="text"
              thousandSeparator
              decimalScale={2}
              prefix="$"
            />
          </dd>
        </div>

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
              {ethList.map((token) => {
                const isEth = token === 'eth'
                const balance = isEth ? ethBalance : wethBalance
                const usdValue = isEth ? ethUsdValue : wethUsdValue

                const balanceAmount = new Decimal(balance)
                const isBalanceLessThanMinAmount =
                  !balanceAmount.isZero() && balanceAmount.lt(0.0001)

                return (
                  <div
                    className={clsx(styles.detailItem, {
                      [styles.selected]: currentEthType === token,
                    })}
                    key={`myWallet-ethType=${token}`}
                    onClick={handleSelectEthType}
                    role={isSelectable ? 'button' : undefined}
                    data-eth-type={token}
                  >
                    <dt>
                      <strong>{token}</strong>
                      <span>{isEth ? 'Ether' : 'Wrapped Ether'}</span>
                    </dt>
                    <dd>
                      {isBalanceLessThanMinAmount ? (
                        '< 0.0001'
                      ) : (
                        <NumberFormat
                          value={balance}
                          displayType="text"
                          thousandSeparator
                          decimalScale={4}
                        />
                      )}
                      <NumberFormat
                        className={styles.usd}
                        value={usdValue}
                        displayType="text"
                        thousandSeparator
                        decimalScale={2}
                        prefix="$"
                      />
                    </dd>
                  </div>
                )
              })}
            </dl>
          </dd>
        </div>

        <div className={styles.total}>
          <dt>Total</dt>
          <dd>
            <NumberFormat
              value={totalValue}
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
