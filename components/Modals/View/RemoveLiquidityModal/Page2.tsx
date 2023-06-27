import { useAtomValue } from 'jotai'
import { motion } from 'framer-motion'

import { ANIMATION_MAP, MOTION } from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import { useFiat, useModal, useStaking } from 'hooks'
import { actualAmountsOutAtom } from './useWatch'

import { StyledRemoveLiquidityModalPage2 } from './styled'
import Button from 'components/Button'
import ImportToken from 'components/ImportToken'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'

type RemoveLiquidityModalPage2Props = {
  assets: Hash[]
}

export default function RemoveLiquidityModalPage2({
  assets,
}: RemoveLiquidityModalPage2Props) {
  const actualTokenAmountsOut = useAtomValue(actualAmountsOutAtom)

  const toFiat = useFiat()
  const { removeModal } = useModal()
  const { rewardTokenAddresses } = useStaking()
  const { tokens } = useStaking()

  const showResult = actualTokenAmountsOut.some((amt) => bnum(amt).gt(0))
  const amountsOutFiatValue = actualTokenAmountsOut.map((amt, i) =>
    toFiat(amt, assets[i])
  )

  const amountOutFiatValueSum = amountsOutFiatValue
    .reduce((acc, amt) => acc.plus(amt), bnum(0))
    .toString()

  const rewardTokenAddress = rewardTokenAddresses[0]
  const rewardToken = tokens[rewardTokenAddress]

  return (
    <StyledRemoveLiquidityModalPage2>
      <header className="modalHeader">
        <h2 className="title">Exit completed!</h2>
      </header>

      <div className="container">
        <div className="modalContent">
          <motion.dl
            {...MOTION}
            className="detailList"
            variants={ANIMATION_MAP.fadeIn}
          >
            {showResult &&
              actualTokenAmountsOut.map((amt, i) => {
                const addr = assets[i]
                const { symbol } = tokens?.[addr] ?? {}
                const fiatValue = amountsOutFiatValue[i]

                return (
                  <div className="detailItem" key={`exitResult:${amt}:${addr}`}>
                    <dt>
                      <TokenIcon address={addr} />
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

            {showResult && (
              <div className="detailItem total">
                <dt>Total exit</dt>
                <dd>
                  <NumberFormat
                    value={amountOutFiatValueSum}
                    type="fiat"
                    prefix="$"
                  />
                </dd>
              </div>
            )}
          </motion.dl>

          <ImportToken address={rewardToken.address} />
        </div>
      </div>

      <footer className="modalFooter">
        <Button type="button" onClick={removeModal} $size="md">
          Go to main
        </Button>
      </footer>
    </StyledRemoveLiquidityModalPage2>
  )
}
