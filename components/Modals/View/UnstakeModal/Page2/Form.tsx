import type {
  Control as ReactHookFormControl,
  FieldValues,
} from 'react-hook-form'
import NumberFormat from 'components/NumberFormat'
import clsx from 'clsx'

import { bnum } from 'utils/bnum'
import { useFiat, useStaking } from 'hooks'
import { UseUnstakeFormReturns } from '../useUnstakeForm'

import { StyledUnstakeModalPage2Form } from './styled'
import Checkbox from 'components/Checkbox'
import { AvailableBalance, Control } from 'components/Form'

type UnstakeModalPage2FormProps = {
  disabled: boolean
  earnedRewards: string[]
  rewardFiatValue: string
} & UseUnstakeFormReturns

export default function UnstakeModalPage2Form({
  disabled: _disabled,
  earnedRewards,
  rewardFiatValue,
  ...props
}: UnstakeModalPage2FormProps) {
  const toFiat = useFiat()
  const { stakedTokenAddress, tokenMap } = useStaking()
  const hasRewards = earnedRewards.some((r) => bnum(r).gt(0))

  const stakedTokenDecimals = tokenMap[stakedTokenAddress].decimals

  const {
    checked,
    control,
    maxBalance,
    rules,
    setMaxValue,
    inputDisabled,
    placeholder,
    toggleCheck,
  } = props
  const maxBalanceInFiatValue = toFiat(maxBalance, stakedTokenAddress)

  const disabled = _disabled || !hasRewards

  return (
    <StyledUnstakeModalPage2Form>
      <Control<'number'>
        id="unstakeAmount"
        control={control as unknown as ReactHookFormControl<FieldValues, 'any'>}
        name="unstakeAmount"
        address={stakedTokenAddress}
        rules={rules}
        maxAmount={maxBalance}
        decimals={stakedTokenDecimals}
        setMaxValue={setMaxValue}
        showFiatValue
        disabled={inputDisabled || disabled}
        placeholder={placeholder}
        $size="md"
        type="number"
      />
      <AvailableBalance
        label="Withdrawable LP tokens"
        maxAmount={maxBalance}
        fiatValue={maxBalanceInFiatValue}
      />

      <div className={clsx('claimCheckbox', { disabled })}>
        <h4 className="label">I want to claim the rewards as well.</h4>
        <p className="desc">
          Claimable rewards
          <NumberFormat value={rewardFiatValue} type="fiat" colon />
        </p>

        <Checkbox
          id="checked"
          checked={!hasRewards ? false : checked}
          onChange={toggleCheck}
          disabled={disabled}
          $size={24}
        />
      </div>
    </StyledUnstakeModalPage2Form>
  )
}
