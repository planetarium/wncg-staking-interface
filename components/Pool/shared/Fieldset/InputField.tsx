import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { usePrevious } from 'react-use'
import {
  Control as ReactHookFormControl,
  FieldValues,
  UseFormClearErrors,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form'
import { AnimatePresence } from 'framer-motion'

import { useFiat } from 'hooks'
import config from 'config'
import { bnum } from 'utils/bnum'
import { JoinFormFields, joinFormFields } from 'hooks/useJoinForm'

import { StyledJoinFormInputField } from './styled'
import { AvailableBalance, Control } from 'components/Form'
import NumberFormat from 'components/NumberFormat'
import EtherSelect from './EtherSelect'
import Warning from './Warning'

type JoinInputFieldProps = {
  index: number
  token: TokenInfo
  clearErrors: UseFormClearErrors<JoinFormFields>
  control: ReactHookFormControl<JoinFormFields>
  maxBalance: string
  maxSafeBalance: string
  name: 'TokenA' | 'TokenB'
  resetFields(): void
  setValue: UseFormSetValue<JoinFormFields>
  trigger: UseFormTrigger<JoinFormFields>
  value: string
  weight: number
  className?: string
  disabled?: boolean
}

function JoinInputField({
  index,
  token,
  control,
  name,
  maxBalance,
  maxSafeBalance,
  setValue,
  trigger,
  value,
  weight,
  className,
  disabled,
}: JoinInputFieldProps) {
  const [showWarning, setShowWarning] = useState(false)

  const toFiat = useFiat()
  const { address, decimals, symbol } = token
  const prevAddress = usePrevious(address)

  const id = useMemo(() => `joinForm:inputField:${address}`, [address])
  const availableBalanceLabel = useMemo(
    () => `${symbol} in my wallet`,
    [symbol]
  )

  const isEther = [config.weth, config.nativeCurrency.address].includes(address)
  const isNativeCurrency = isEther && address === config.nativeCurrency.address

  const maxBalanceInFiatValue = useMemo(
    () => toFiat(maxBalance, address),
    [address, maxBalance, toFiat]
  )

  const rules = useMemo(
    () => ({
      validate: {
        maxAmount: (v: string) =>
          bnum(v).lte(maxBalance) || `Exceeds wallet balance`,
      },
    }),
    [maxBalance]
  )

  const setMaxValue = useCallback(() => {
    setValue(name, maxSafeBalance)
    trigger()
  }, [maxSafeBalance, name, setValue, trigger])

  useEffect(() => {
    if (address !== config.nativeCurrency.address) return
    if (bnum(value).gte(maxSafeBalance) && bnum(value).lt(maxBalance)) {
      setShowWarning(true)
    } else {
      setShowWarning(false)
    }
  }, [address, maxBalance, maxSafeBalance, value])

  useEffect(() => {
    if (prevAddress !== address) setShowWarning(false)
  }, [address, prevAddress])

  return (
    <StyledJoinFormInputField
      className={className}
      layoutRoot
      $disabled={!!disabled}
    >
      hi
      <div className="labelGroup">
        {isEther ? (
          <EtherSelect
            name={joinFormFields[index]}
            isNativeCurrency={isNativeCurrency}
            setValue={setValue}
            trigger={trigger}
          />
        ) : (
          <label className="label" htmlFor={id}>
            {symbol}
          </label>
        )}
        <NumberFormat
          className="weight"
          value={weight}
          type="percent"
          decimals={0}
        />
      </div>
      <Control<'number'>
        id={id}
        address={token.address}
        control={control as unknown as ReactHookFormControl<FieldValues>}
        name={name}
        rules={rules}
        decimals={decimals}
        setMaxValue={setMaxValue}
        placeholder="0.0"
        showFiatValue
        $size="sm"
        disabled={disabled}
      />
      <AvailableBalance
        layout
        label={availableBalanceLabel}
        maxAmount={maxBalance}
        decimals={4}
        fiatValue={maxBalanceInFiatValue}
      />
      <AnimatePresence>{showWarning && <Warning />}</AnimatePresence>
    </StyledJoinFormInputField>
  )
}

export default memo(JoinInputField)
