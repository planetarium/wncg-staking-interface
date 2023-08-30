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
} & UseUnstakeFormReturns

export default function UnstakeModalPage2Form({
  disabled,
  totalClaimFiatValue,
  ...props
}: UnstakeModalPage2FormProps) {
  const toFiat = useFiat()
  const { lpToken, tokens } = useStaking()
  const hasRewards = bnum(totalClaimFiatValue).gt(0)

  const decimals = tokens[lpToken?.address]?.decimals ?? 18

  const {
    checked,
    control,
    maxBalance,
    rules,
    setMaxValue,
    placeholder,
    toggleCheck,
  } = props
  const maxBalanceInFiatValue = toFiat(maxBalance, lpToken?.address)

  const claimDisabled = !hasRewards

  return (
    <StyledUnstakeModalPage2Form>
      <Control<'number'>
        id="unstakeAmount"
        control={control as unknown as ReactHookFormControl<FieldValues, 'any'>}
        name="unstakeAmount"
        address={lpToken?.address}
        rules={rules}
        maxAmount={maxBalance}
        decimals={decimals}
        setMaxValue={setMaxValue}
        showFiatValue
        disabled={disabled}
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
          <NumberFormat value={totalClaimFiatValue} type="fiat" colon />
        </p>

        <Checkbox
          className="rewardCheckbox"
          id="checked"
          checked={!hasRewards ? false : checked}
          onChange={toggleCheck}
          disabled={claimDisabled}
          $size={24}
        />
      </div>
    </StyledUnstakeModalPage2Form>
  )
}
