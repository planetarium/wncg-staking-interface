import { useMemo, useState } from 'react'
import { useTransaction } from 'wagmi'
import { motion } from 'framer-motion'

import config from 'config'
import { MOTION } from 'config/motions'
import { fadeIn } from 'config/motionVariants'
import { bnum } from 'utils/bnum'
import { formatUnits } from 'utils/formatUnits'
import { parseLog } from 'utils/parseLog'
import { parseTransferLogs } from 'utils/parseTransferLogs'
import { useFiat, useModal, useStaking } from 'hooks'

import { StyledExitModalPage2 } from './styled'
import Button from 'components/Button'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'
import ImportToken from 'components/ImportToken'

type ExitModalPage2Props = {
  assets: Hash[]
  isProportional: boolean
  tokenOutIndex: number
  hash?: Hash
}

export default function ExitModalPage2({
  assets,
  isProportional,
  hash,
  tokenOutIndex,
}: ExitModalPage2Props) {
  const [exitAmounts, setExitAmounts] = useState<string[]>([])

  const toFiat = useFiat()
  const { removeModal } = useModal()
  const {
    poolTokenAddresses,
    poolTokenDecimals,
    stakedTokenAddress,
    tokenMap,
  } = useStaking()

  useTransaction({
    chainId: config.chainId,
    enabled: !!hash,
    hash,
    async onSuccess(tx) {
      const { logs } = await tx.wait()

      const tokenOut = isProportional ? null : assets[tokenOutIndex]

      if (isProportional || tokenOut !== config.nativeCurrency.address) {
        const parsedLogs = parseTransferLogs(logs)
        const receivedTokens = assets.map((addr) => parsedLogs?.[addr])

        if (receivedTokens.length === poolTokenAddresses.length) {
          setExitAmounts(
            receivedTokens.map((amount, i) =>
              formatUnits(amount, poolTokenDecimals[i])
            )
          )
        }

        return
      }

      const parsedLogs = logs.map((l) => parseLog(l))
      const withdrawalLog = parsedLogs.find((l) => {
        return l?.name === 'Withdrawal'
      })

      if (withdrawalLog) {
        setExitAmounts(
          assets.map((addr) => {
            if (addr !== config.nativeCurrency.address) return '0'
            return formatUnits(withdrawalLog.args[1])
          })
        )
      }
    },
  })

  const showExitResult = exitAmounts.length > 0
  const exitAmountsInFiatValue = exitAmounts.map((amt, i) =>
    toFiat(amt, assets[i])
  )
  const totalExitedAmountInFiatValue = exitAmountsInFiatValue
    .reduce((acc, amt, i) => {
      return acc.plus(toFiat(amt, assets[i]))
    }, bnum(0))
    .toString()

  const importConfig = useMemo(() => {
    if (isProportional) {
      const token = tokenMap[stakedTokenAddress]
      return {
        ...token,
        name: undefined,
      }
    }

    const tokenOut = tokenMap?.[assets[tokenOutIndex]]

    return {
      ...tokenOut,
      name: undefined,
    }
  }, [assets, isProportional, stakedTokenAddress, tokenMap, tokenOutIndex])

  return (
    <StyledExitModalPage2>
      <header className="modalHeader">
        <h2 className="title">Exit completed!</h2>
      </header>

      <div className="container">
        <div className="modalContent">
          {showExitResult && (
            <motion.dl {...MOTION} className="detailList" variants={fadeIn}>
              {assets.map((addr, i) => {
                const amt = exitAmounts[i]

                if (bnum(amt).isZero()) return null

                const { symbol } = tokenMap[addr]
                const fiatValue = exitAmountsInFiatValue[i]

                return (
                  <div className="detailItem" key={`exitResult:${amt}:${addr}`}>
                    <dt>
                      <TokenIcon address={addr} $size={20} />
                      {symbol}
                    </dt>

                    <dd>
                      <NumberFormat value={amt} decimals={8} />

                      <span className="fiatValue">
                        <NumberFormat
                          value={fiatValue}
                          type="fiat"
                          prefix="$"
                        />
                      </span>
                    </dd>
                  </div>
                )
              })}

              <div className="detailItem total">
                <dt>Total exit</dt>
                <dd>
                  <NumberFormat
                    className="active"
                    value={totalExitedAmountInFiatValue}
                    type="fiat"
                  />
                </dd>
              </div>
            </motion.dl>
          )}
        </div>

        <ImportToken {...importConfig} />
      </div>

      <footer className="modalFooter">
        <Button type="button" onClick={removeModal} $size="md">
          Go to main
        </Button>
      </footer>
    </StyledExitModalPage2>
  )
}
