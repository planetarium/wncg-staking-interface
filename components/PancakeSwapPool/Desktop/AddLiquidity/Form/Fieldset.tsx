import { useStaking } from 'hooks'
import type { UseAddLiquidityFormReturns } from 'hooks/pancakeswap/useAddLiquidityForm'
import { useAddLiquidityMath } from 'hooks/pancakeswap'

import { StyledAddLiquidityFormFieldset } from './styled'
import InputField from './InputField'

type AddLiquidityFormFieldsetProps = UseAddLiquidityFormReturns

export default function AddLiquidityFormFieldset({
  activeField,
  clearErrors,
  amountsIn,
  control,
  fields,
  focusedElement,
  formState,
  resetFields,
  setActiveField,
  setFocusedElement,
  setValue,
  trigger,
  watch,
}: AddLiquidityFormFieldsetProps) {
  const { poolTokens, poolTokenAddresses } = useStaking()
  const { maxBalances, maxSafeBalances } = useAddLiquidityMath()

  return (
    <StyledAddLiquidityFormFieldset layoutRoot>
      {poolTokens.map((t, i) => {
        const field = fields[i] as 'TokenA' | 'TokenB'
        const address = t.address

        const maxBalance = maxBalances[i]
        const maxSafeBalance = maxSafeBalances[i]

        const subjectFieldName = fields[1 - i] as 'TokenA' | 'TokenB'
        const subjectTokenAddress = poolTokenAddresses[1 - i]

        const value = amountsIn[i]

        return (
          <InputField
            className="joinInputField"
            key={`addLiquidityForm:inputField:${address}`}
            token={t}
            name={field}
            index={i}
            activeField={activeField as 'TokenA' | 'TokenB' | null}
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
          />
        )
      })}
    </StyledAddLiquidityFormFieldset>
  )
}
