import { useMemo } from 'react'
import { UseFormSetValue } from 'react-hook-form'

import { RemoveLiquidityField } from 'config/constants'
import { bnum } from 'utils/bnum'
import { useChain, useFiat, useStaking } from 'hooks'
import type { RemoveLiquidityForm } from 'hooks/pancakeswap/useRemoveLiquidityForm'

import { StyledRemoveLiquidityModalPageFormSummary } from './styled'
import CountUp from 'components/CountUp'
import NumberFormat from 'components/NumberFormat'
import Radio from 'components/Radio'
import TokenIcon from 'components/TokenIcon'

type RemoveLiquidityModalPageFormSummaryProps = {
  assets: Hash[]
  amountsOut: string[]
  amountsOutFiatValue: string[]
  isNative: boolean
  setValue: UseFormSetValue<RemoveLiquidityForm>
  disabled: boolean
}

export default function RemoveLiquidityModalPageFormSummary({
  assets,
  amountsOut,
  amountsOutFiatValue,
  isNative,
  setValue,
  disabled,
}: RemoveLiquidityModalPageFormSummaryProps) {
  const { nativeCurrency } = useChain()
  const toFiat = useFiat()
  const { tokens } = useStaking()

  const poolTokens = assets.map((addr) => tokens[addr])

  const relativePrice = useMemo(() => {
    return poolTokens.map((t, i) => {
      const currentTokenPrice = toFiat(1, t.address)
      const subjectTokenPrice = toFiat(1, poolTokens[1 - i].address)
      return bnum(currentTokenPrice).div(subjectTokenPrice).toString()
    })
  }, [poolTokens, toFiat])

  function onClickCheckbox(value: string) {
    setValue(RemoveLiquidityField.UseNative, value === '0' ? false : true)
  }

  return (
    <StyledRemoveLiquidityModalPageFormSummary>
      <h5 className="title">
        You will receive
        <div className="radioGroup">
          <div className="radioItem">
            <Radio
              id="isNativeTrue"
              selected={isNative}
              name={RemoveLiquidityField.UseNative}
              onChange={onClickCheckbox}
              value={1}
              disabled={disabled}
            />
            <label className="text" htmlFor="isNativeTrue">
              {nativeCurrency.symbol}
            </label>
          </div>
          <div className="radioItem">
            <Radio
              id="isNativeFalse"
              selected={!isNative}
              name={RemoveLiquidityField.UseNative}
              onChange={onClickCheckbox}
              value={0}
              disabled={disabled}
            />
            <label className="text" htmlFor="isNativeFalse">
              {tokens?.[nativeCurrency.wrappedTokenAddress]?.symbol}
            </label>
          </div>
        </div>
      </h5>

      <div className="content">
        <dl className="formSummaryList">
          {assets.map((addr, i) => {
            const token = tokens?.[addr]

            return (
              <div
                className="formSummaryItem"
                key={`removeLiquidityForm:${addr}`}
              >
                <dt>
                  <TokenIcon address={addr} $size={24} />
                  {token.symbol}
                  <span className="parenthesis">50%</span>
                </dt>

                <dd>
                  <NumberFormat value={amountsOut[i]} />
                  <CountUp value={amountsOutFiatValue[i]} type="fiat" />
                </dd>
              </div>
            )
          })}
        </dl>

        <span className="divider" />

        <dl className="currentPrice">
          <dt>Current price</dt>

          <dd>
            {assets.map((addr, i) => {
              const token = tokens?.[addr]
              const subjectToken = tokens[assets[1 - i]]

              return (
                <div
                  className="price"
                  key={`removeLiquidityForm:currentPrice:${addr}`}
                >
                  <NumberFormat value={1} symbol={token.symbol} decimals={0} />
                  <NumberFormat
                    equals
                    value={relativePrice[i]}
                    symbol={subjectToken.symbol}
                    decimals={8}
                  />
                </div>
              )
            })}
          </dd>
        </dl>
      </div>
    </StyledRemoveLiquidityModalPageFormSummary>
  )
}
