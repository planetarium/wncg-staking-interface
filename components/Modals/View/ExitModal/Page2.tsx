import { useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'
import { motion } from 'framer-motion'

import { ANIMATION_MAP, MOTION } from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import { useFiat, useModal, useStaking } from 'hooks'
import { exitAmountsAtom } from './useWatch'

import { StyledExitModalPage2 } from './styled'
import Button from 'components/Button'
import ImportToken from 'components/ImportToken'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'

type ExitModalPage2Props = {
  assets: Hash[]
  isPropExit: boolean
  tokenOutIndex: number
}

export default function ExitModalPage2({
  assets,
  isPropExit,

  tokenOutIndex,
}: ExitModalPage2Props) {
  const toFiat = useFiat()
  const { removeModal } = useModal()
  const { lpToken, tokens } = useStaking()

  const exitAmounts = useAtomValue(exitAmountsAtom)

  const showExitResult = exitAmounts.length > 0
  const exitAmountsInFiatValue = exitAmounts.map((amt, i) =>
    toFiat(amt, assets[i])
  )
  const totalExitedAmountInFiatValue = exitAmountsInFiatValue
    .reduce((acc, amt) => acc.plus(amt), bnum(0))
    .toString()

  const importTokenAddress = useMemo(() => {
    if (isPropExit) {
      return lpToken?.address
    }

    return tokens?.[assets[tokenOutIndex]]?.address
  }, [assets, isPropExit, lpToken?.address, tokens, tokenOutIndex])

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
              {assets.map((addr, i) => {
                const amt = exitAmounts[i]

                if (bnum(amt).isZero()) return null

                const symbol = tokens[addr]?.symbol ?? ''
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
