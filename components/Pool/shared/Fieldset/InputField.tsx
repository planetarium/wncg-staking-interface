import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { usePrevious } from 'react-use'
import {
  Control as ReactHookFormControl,
  FieldValues,
  UseFormClearErrors,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form'
import { AnimatePresence } from 'framer-motion'
import { useSetAtom } from 'jotai'

import { showOptimizeErrorAtom } from 'states/form'
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
  watch: UseFormWatch<JoinFormFields>
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
  watch,
  weight,
  className,
  disabled,
}: JoinInputFieldProps) {
  const [showWarning, setShowWarning] = useState(false)

  const toFiat = useFiat()
  const { address, decimals, symbol } = token
  const prevAddress = usePrevious(address)

  const setShowOptError = useSetAtom(showOptimizeErrorAtom)

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
      onChange() {
        setShowOptError(false)
      },
    }),
    [maxBalance, setShowOptError]
  )

  const setMaxValue = useCallback(() => {
    setValue(name, maxSafeBalance)
    trigger()
  }, [maxSafeBalance, name, setValue, trigger])

  const currentValue = watch(name)

  useEffect(() => {
    if (address !== config.nativeCurrency.address) return
    if (currentValue === '') return
    if (bnum(value).gte(maxSafeBalance) && bnum(value).lt(maxBalance)) {
      setShowWarning(true)
    } else {
      setShowWarning(false)
    }
  }, [address, currentValue, maxBalance, maxSafeBalance, value])

  useEffect(() => {
    if (prevAddress !== address) setShowWarning(false)
  }, [address, prevAddress])

  return (
    <StyledJoinFormInputField
      className={className}
      layoutRoot
      $disabled={!!disabled}
    >
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
        maxAmount={maxBalance}
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
