import { useChain, useStaking } from 'hooks'
import {
  FIELDS,
  UseAddLiquidityFormReturns,
} from 'hooks/pancakeswap/useAddLiquidityForm'

import { StyledAddLiquidityFormFieldset } from './styled'
import InputField from './InputField'

type AddLiquidityFormFieldsetProps = UseAddLiquidityFormReturns

export default function AddLiquidityFormFieldset(
  props: AddLiquidityFormFieldsetProps
) {
  const { amountsIn, isNative } = props
  const { nativeCurrency } = useChain()
  const { poolTokenAddresses, shouldReversePoolTokenOrderOnDisplay, tokens } =
    useStaking()

  const ethIndex = shouldReversePoolTokenOrderOnDisplay ? 0 : 1

  return (
    <StyledAddLiquidityFormFieldset
      layoutRoot
      $reverse={shouldReversePoolTokenOrderOnDisplay}
    >
      {poolTokenAddresses.map((addr, i) => {
        const field = FIELDS[i] as 'TokenA' | 'TokenB'

        const token =
          ethIndex !== i || !isNative
            ? tokens?.[addr] ?? {}
            : {
                address: nativeCurrency.address,
                decimals: nativeCurrency.decimals,
                symbol: nativeCurrency.symbol,
                name: nativeCurrency.name,
              }

        const value = amountsIn[i]

        return (
          <InputField
            className="joinInputField"
            key={`addLiquidityForm:inputField:${addr}`}
            token={token}
            name={field}
            index={i}
            value={value}
            {...props}
          />
        )
      })}
    </StyledAddLiquidityFormFieldset>
  )
}
