import config from 'config'
import { bnum } from 'utils/bnum'
import { useAuth, useStaking } from 'hooks'
import { UseJoinFormReturns } from 'hooks/useJoinForm'

import { StyledJoinFormFieldset } from './styled'
import InputField from './InputField'

type JoinFormFieldsetProps = UseJoinFormReturns

export default function JoinFormFieldset({
  clearErrors,
  joinAmounts,
  maxBalances,
  maxSafeBalances,
  watch,
  control,
  fields,
  resetFields,
  setValue,
  trigger,
}: JoinFormFieldsetProps) {
  const { isConnected } = useAuth()
  const { poolTokens, shouldReversePoolTokenOrder } = useStaking()

  const isNativeCurrency = watch('isNativeCurrency')

  return (
    <StyledJoinFormFieldset layoutRoot $reverse={shouldReversePoolTokenOrder}>
      {poolTokens.map((poolToken, i) => {
        const field = fields[i] as 'TokenA' | 'TokenB'
        let address = poolToken.address
        if (isNativeCurrency && poolToken.address === config.weth) {
          poolToken = {
            ...poolToken,
            address: config.nativeCurrency.address,
            decimals: config.nativeCurrency.decimals,
            name: config.nativeCurrency.name,
            symbol: config.nativeCurrency.symbol,
          }
        }

        const maxBalance = maxBalances[i]
        const maxSafeBalance = maxSafeBalances[i]

        const value = joinAmounts[i]

        const weight = bnum(poolToken.weight).times(100).toNumber()

        return (
          <InputField
            className="joinInputField"
            index={i}
            key={`joinForm:inputField:${address}`}
            token={poolToken}
            name={field}
            clearErrors={clearErrors}
            control={control}
            maxBalance={maxBalance}
            maxSafeBalance={maxSafeBalance}
            resetFields={resetFields}
            setValue={setValue}
            trigger={trigger}
            value={value}
            watch={watch}
            weight={weight}
            disabled={!isConnected}
          />
        )
      })}
    </StyledJoinFormFieldset>
  )
}
