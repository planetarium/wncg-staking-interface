import { ChangeEvent } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'

import { EXIT_MOTION } from 'config/motions'
import { fadeIn } from 'config/motionVariants'
import { bnum } from 'utils/bnum'
import { useFiat, useStaking } from 'hooks'
import { ClaimFormFields } from '../useClaimForm'

import { StyledClaimModalPage1Form } from './styled'
import Icon from 'components/Icon'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'

type ClaimModalPage1FormProps = {
  rewardList: boolean[]
  earnedRewards: string[]
  setValue: UseFormSetValue<ClaimFormFields>
  disabled: boolean
}

export default function ClaimModalPage1Form({
  rewardList,
  earnedRewards,
  setValue,
  disabled: _disabled,
}: ClaimModalPage1FormProps) {
  const toFiat = useFiat()
  const { rewardTokenAddresses, tokenMap } = useStaking()

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
          const { symbol } = tokenMap[addr]
          const amount = earnedRewards[i]
          const fiatValue = toFiat(amount, addr)
          const id = `claimModal:page1:form:${addr}`
          const checked = !!rewardList[i]
          const hasAmount = bnum(amount).gt(0)

          const disabled = _disabled || !hasAmount

          return (
            <label
              className={clsx('rewardCard', {
                selected: checked,
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
                    variants={fadeIn}
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
              />

              <input
                id={id}
                type="checkbox"
                value={i}
                onChange={onCheckboxChange}
                defaultChecked={checked}
                disabled={disabled}
              />
            </label>
          )
        })}
      </fieldset>
    </StyledClaimModalPage1Form>
  )
}
