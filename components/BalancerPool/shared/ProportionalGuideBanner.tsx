import type { UseFormSetValue, UseFormStateReturn } from 'react-hook-form'
import { AnimatePresence } from 'framer-motion'

import { LiquidityFieldType } from 'config/constants'
import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import { useStaking } from 'hooks'
import { useJoinMath } from 'hooks/balancer'
import type { JoinPoolForm } from 'hooks/balancer/useJoinForm'

import { StyledJoinFormProportionalGuideBanner } from './styled'
import Icon from 'components/Icon'
import NumberFormat from 'components/NumberFormat'

type JoinFormProportionalGuideBannerProps = {
  joinAmounts: string[]
  isNative: boolean
  assets: Hash[]
  maxBalances: string[]
  formState: UseFormStateReturn<JoinPoolForm>
  setValue: UseFormSetValue<JoinPoolForm>
}

function JoinFormProportionalGuideBanner({
  joinAmounts,
  isNative,
  assets,
  maxBalances,
  formState,
  setValue,
}: JoinFormProportionalGuideBannerProps) {
  const { poolTokens, tokens } = useStaking()
  const { calcPropAmountsIn } = useJoinMath(isNative)

  const fixedTokenIndex = joinAmounts.findIndex((amt, i) => {
    return bnum(amt).gt(0) && bnum(joinAmounts[1 - i]).isZero()
  })
  const variantTokenIndex = 1 - fixedTokenIndex

  const hasSingleFixedField = fixedTokenIndex > -1
  const fixedToken = poolTokens[fixedTokenIndex]

  const propAmountsIn = hasSingleFixedField
    ? calcPropAmountsIn(joinAmounts[fixedTokenIndex], fixedToken)
    : ['0', '0']

  const selectedTokenAddress = assets[fixedTokenIndex]
  const selectedToken = tokens[selectedTokenAddress] ?? {}
  const variantTokenAddress = assets[variantTokenIndex]
  const variantToken = tokens[variantTokenAddress] ?? {}

  function handleAdd() {
    propAmountsIn.forEach((amt, i) => {
      setValue(
        i === 0 ? LiquidityFieldType.TokenA : LiquidityFieldType.TokenB,
        amt
      )
    })
  }

  const show =
    Object.keys(formState?.errors).length === 0 &&
    hasSingleFixedField &&
    propAmountsIn.every((amt) => bnum(amt).gt(0)) &&
    propAmountsIn.every((amt, i) => bnum(amt).lte(maxBalances[i]))

  return (
    <AnimatePresence>
      {show && (
        <StyledJoinFormProportionalGuideBanner
          {...EXIT_MOTION}
          className="joinFormProportionalGuide"
          variants={ANIMATION_MAP.slideInDown}
        >
          <h4 className="title">
            <Icon icon="star" />
            Recommendation
          </h4>

          <p className="desc">
            Add
            <NumberFormat
              value={propAmountsIn[variantTokenIndex]}
              symbol={variantToken.symbol}
            />{' '}
            matching with{' '}
            <NumberFormat
              value={joinAmounts[fixedTokenIndex]}
              symbol={selectedToken.symbol}
            />{' '}
            for the minimal slippage.
          </p>

          <button className="addButton" type="button" onClick={handleAdd}>
            Add <NumberFormat value={propAmountsIn[variantTokenIndex]} />{' '}
            {variantToken.symbol}
          </button>
        </StyledJoinFormProportionalGuideBanner>
      )}
    </AnimatePresence>
  )
}

export default JoinFormProportionalGuideBanner
