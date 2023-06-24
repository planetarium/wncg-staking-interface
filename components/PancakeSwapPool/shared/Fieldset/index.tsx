import { AddLiquidityField } from 'config/constants'
import { useAuth, useChain, useStaking } from 'hooks'
import { UseAddLiquidityFormReturns } from 'hooks/pancakeswap/useAddLiquidityForm'

import { StyledAddLiquidityFieldset } from './styled'
import InputField from './InputField'

type AddLiquidityFieldsetProps = UseAddLiquidityFormReturns

export default function AddLiquidityFieldset({
  activeField,
  clearErrors,
  amountsIn,
  maxBalances,
  maxSafeBalances,
  watch,
  control,
  fields,
  formState,
  optimizeDisabled,
  setValue,
  trigger,
  setFocusedElement,
  setActiveField,
  resetFields,
  focusedElement,
}: AddLiquidityFieldsetProps) {
  const { poolTokens, shouldReversePoolTokenOrderOnDisplay } = useStaking()

  const isNative = watch(AddLiquidityField.UseNative)

  return (
    <StyledAddLiquidityFieldset
      layoutRoot
      $reverse={shouldReversePoolTokenOrderOnDisplay}
    >
      {poolTokens.map((t, i) => {
        const field = fields[i] as 'TokenA' | 'TokenB'
        const address = t.address

        const maxBalance = maxBalances[i]
        const maxSafeBalance = maxSafeBalances[i]

        const subjectFieldName = fields[1 - i] as 'TokenA' | 'TokenB'
        const value = amountsIn[i]

        return (
          <InputField
            className="joinInputField"
            key={`addLiquidityForm:inputField:${address}`}
            token={t}
            name={field}
            index={i}
            activeField={activeField}
            clearErrors={clearErrors}
            control={control}
            focusedElement={focusedElement}
            formState={formState}
            maxBalance={maxBalance}
            maxSafeBalance={maxSafeBalance}
            resetFields={resetFields}
            setActiveField={setActiveField}
            setFocusedElement={setFocusedElement}
            setValue={setValue}
            subjectFieldName={subjectFieldName}
            trigger={trigger}
            value={value}
            watch={watch}
            optimizeDisabled={optimizeDisabled}
          />
        )
      })}
    </StyledAddLiquidityFieldset>
  )
}
