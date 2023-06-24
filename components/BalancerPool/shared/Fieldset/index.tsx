import { LiquidityFieldType } from 'config/constants'
import { bnum } from 'utils/bnum'
import { useAuth, useChain, useStaking } from 'hooks'
import { UseJoinFormReturns } from 'hooks/balancer/useJoinForm'

import { StyledJoinFormFieldset } from './styled'
import InputField from './InputField'

type JoinFormFieldsetProps = UseJoinFormReturns

export default function JoinFormFieldset({
  activeField,
  clearErrors,
  joinAmounts,
  maxBalances,
  maxSafeBalances,
  watch,
  control,
  fields,
  resetFields,
  formState,
  optimizeDisabled,
  setValue,
  trigger,
  setFocusedElement,
  setActiveField,
  focusedElement,
}: JoinFormFieldsetProps) {
  const { isConnected } = useAuth()
  const { nativeCurrency } = useChain()
  const { poolTokens, shouldReversePoolTokenOrderOnDisplay } = useStaking()

  const isNativeCurrency = watch(LiquidityFieldType.UseNative)

  return (
    <StyledJoinFormFieldset
      layoutRoot
      $reverse={shouldReversePoolTokenOrderOnDisplay}
    >
      {poolTokens.map((t, i) => {
        const field = fields[i] as 'TokenA' | 'TokenB'
        let address = t.address
        const { coingeckoId, wrappedTokenAddress, ...rest } = nativeCurrency
        if (t.address === wrappedTokenAddress && isNativeCurrency) {
          t = {
            ...t,
            ...rest,
          }
        }

        const maxBalance = maxBalances[i]
        const maxSafeBalance = maxSafeBalances[i]

        const value = joinAmounts[i]

        const weight = bnum(t.weight).times(100).toNumber()

        return (
          <InputField
            className="joinInputField"
            index={i}
            key={`joinForm:inputField:${address}`}
            token={t}
            name={field}
            clearErrors={clearErrors}
            control={control}
            formState={formState}
            activeField={activeField}
            focusedElement={focusedElement}
            setFocusedElement={setFocusedElement}
            maxBalance={maxBalance}
            maxSafeBalance={maxSafeBalance}
            setValue={setValue}
            trigger={trigger}
            value={value}
            setActiveField={setActiveField}
            watch={watch}
            weight={weight}
            optimizeDisabled={optimizeDisabled}
            disabled={!isConnected}
          />
        )
      })}
    </StyledJoinFormFieldset>
  )
}
