import { ChangeEvent } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'

import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import { isEthereum } from 'utils/isEthereum'
import { useChain, useFiat, useStaking } from 'hooks'
import { ClaimFormFields } from '../useClaimForm'

import { StyledClaimModalPage1Form } from './styled'
import Icon from 'components/Icon'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'

type ClaimModalPage1FormProps = {
  rewardList: boolean[]
  earnedTokenRewards: string[]
  setValue: UseFormSetValue<ClaimFormFields>
  disabled: boolean
}

export default function ClaimModalPage1Form({
  rewardList,
  earnedTokenRewards,
  setValue,
  disabled: _disabled,
}: ClaimModalPage1FormProps) {
  const { chainId } = useChain()
  const toFiat = useFiat()
  const { rewardTokenAddresses, tokens } = useStaking()

  function onCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    const { value: index, checked } = e.currentTarget

    const list = [...rewardList]
    list[Number(index)] = checked

    setValue('rewardList', list)
  }

  return (
    <StyledClaimModalPage1Form>
      <fieldset className="rewardGroup">
        {rewardTokenAddresses.map((addr, i) => {
          const id = `claimModal:page1:form:${addr}`

          const amount = earnedTokenRewards[i]
          const fiatValue = toFiat(amount, addr)
          const hasAmount = bnum(amount).gt(0)

          const symbol = tokens[addr]?.symbol
          const checked = !!rewardList[i]
          const disabled = _disabled || !hasAmount

          return (
            <label
              className={clsx('rewardCard', {
                selected: checked,
                presentation: rewardTokenAddresses.length === 1,
                disabled,
              })}
              key={id}
              htmlFor={id}
            >
              <AnimatePresence>
                {checked && (
                  <motion.div
                    {...EXIT_MOTION}
                    className="iconContainer"
                    variants={ANIMATION_MAP.fadeIn}
                  >
                    <Icon icon="check" $size={32} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="tokenName">
                <TokenIcon address={addr} />
                <strong>{symbol}</strong>
              </div>

              <NumberFormat
                className="amount"
                value={amount}
                plus={hasAmount}
              />

              <NumberFormat
                className="fiatValue"
                value={fiatValue}
                type="fiat"
                abbr
              />

              {isEthereum(chainId) && (
                <input
                  id={id}
                  type="checkbox"
                  value={i}
                  onChange={onCheckboxChange}
                  defaultChecked={checked}
                  disabled={disabled}
                />
              )}
            </label>
          )
        })}
      </fieldset>
    </StyledClaimModalPage1Form>
  )
}
