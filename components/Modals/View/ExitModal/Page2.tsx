import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { motion } from 'framer-motion'

import { NATIVE_CURRENCY_ADDRESS } from 'config/constants/addresses'
import { ANIMATION_MAP, MOTION } from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import { useChain, useFiat, useModal, useStaking } from 'hooks'
import { exitAmountsAtom } from './useWatch'

import { StyledExitModalPage2 } from './styled'
import Button from 'components/Button'
import ImportToken from 'components/ImportToken'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'

type ExitModalPage2Props = {
  assets: Hash[]
  exitType: Hash | null
  tokenOutIndex?: number
}

export default function ExitModalPage2({ exitType }: ExitModalPage2Props) {
  const { nativeCurrency } = useChain()
  const toFiat = useFiat()
  const { removeModal } = useModal()
  const { lpToken, poolTokenAddresses, tokens } = useStaking()

  const exitAmounts = useAtomValue(exitAmountsAtom)

  const showExitResult = exitAmounts.length > 0

  const amountsOutFiatValue = exitAmounts.map((amt, i) =>
    toFiat(amt, poolTokenAddresses[i])
  )

  const totalAmountsOutFiatSumValue = amountsOutFiatValue
    .reduce((acc, amt) => acc.plus(amt), bnum(0))
    .toString()

  const importTokenAddress = useMemo(() => {
    if (exitType == null) return lpToken?.address
    return tokens[exitType]!.address
  }, [exitType, lpToken?.address, tokens])

  return (
    <StyledExitModalPage2>
      <header className="modalHeader">
        <h2 className="title">Exit completed!</h2>
      </header>

      <div className="container">
        <div className="modalContent">
          {showExitResult && (
            <motion.dl
              {...MOTION}
              className="detailList"
              variants={ANIMATION_MAP.fadeIn}
            >
              {exitAmounts.map((amt, i) => {
                if (bnum(amt).isZero()) return null

                let addr = poolTokenAddresses[i]
                if (
                  exitType === NATIVE_CURRENCY_ADDRESS &&
                  addr === nativeCurrency.wrappedTokenAddress
                ) {
                  addr = nativeCurrency.address
                }

                const { symbol } = tokens[addr] ?? {}
                const fiatValue = amountsOutFiatValue[i]

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
                    value={totalAmountsOutFiatSumValue}
                    type="fiat"
                  />
                </dd>
              </div>
            </motion.dl>
          )}
        </div>

        <ImportToken address={importTokenAddress} />
      </div>

      <footer className="modalFooter">
        <Button type="button" onClick={removeModal} $size="md">
          Go to main
        </Button>
      </footer>
    </StyledExitModalPage2>
  )
}
