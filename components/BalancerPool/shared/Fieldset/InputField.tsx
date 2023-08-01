import { memo, useCallback, useEffect, useMemo } from 'react'
import { usePrevious } from 'react-use'
import {
  Control as ReactHookFormControl,
  FieldValues,
  UseFormClearErrors,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form'

import { LiquidityFieldType } from 'config/constants'
import { useChain, useFiat } from 'hooks'
import { bnum } from 'utils/bnum'
import {
  JoinPoolForm,
  JoinPoolFormElement,
  FIELDS,
} from 'hooks/balancer/useJoinForm'

import { StyledJoinFormInputField } from './styled'
import { AvailableBalance, Control } from 'components/Form'
import NumberFormat from 'components/NumberFormat'
import EtherSelect from './EtherSelect'
import Notice from './Notice'

type JoinInputFieldProps = {
  activeField: LiquidityFieldType | null
  index: number
  token: TokenInfo
  clearErrors: UseFormClearErrors<JoinPoolForm>
  control: ReactHookFormControl<JoinPoolForm>
  maxBalance: string
  maxSafeBalance: string
  name: 'TokenA' | 'TokenB'
  focusedElement: JoinPoolFormElement
  setValue: UseFormSetValue<JoinPoolForm>
  formState: UseFormStateReturn<JoinPoolForm>
  trigger: UseFormTrigger<JoinPoolForm>
  value: string
  weight: number
  watch: UseFormWatch<JoinPoolForm>
  setFocusedElement(value: JoinPoolFormElement): void
  optimizeDisabled: boolean
  setActiveField(field: LiquidityFieldType | null): void
  className?: string
  disabled?: boolean
}

function JoinInputField({
  activeField,
  index,
  token,
  control,
  name,
  maxBalance,
  maxSafeBalance,
  setValue,
  trigger,
  formState,
  focusedElement,
  value,
  setActiveField,
  weight,
  className,
  setFocusedElement,
  optimizeDisabled,
  disabled,
  watch,
}: JoinInputFieldProps) {
  const { nativeCurrency } = useChain()
  const toFiat = useFiat()
  const { address, decimals, symbol } = token
  const prevAddress = usePrevious(address)

  const id = useMemo(() => `joinForm:inputField:${address}`, [address])
  const availableBalanceLabel = useMemo(
    () => `${symbol} in my wallet`,
    [symbol]
  )

  const isEther = [
    nativeCurrency.wrappedTokenAddress,
    nativeCurrency.address,
  ].includes(address)
  const isNative = watch(LiquidityFieldType.UseNative)

  const maxBalanceFiatValue = useMemo(
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
        if (activeField !== name) setActiveField(name)
        setFocusedElement('Input')
      },
    }),
    [activeField, maxBalance, name, setActiveField, setFocusedElement]
  )

  const setMaxValue = useCallback(() => {
    setValue(name, maxSafeBalance)
    setFocusedElement('Max')
    setActiveField(name)
    trigger()
  }, [
    maxSafeBalance,
    name,
    setActiveField,
    setFocusedElement,
    setValue,
    trigger,
  ])

  useEffect(() => {
    if (prevAddress !== address) {
      setFocusedElement(null)
    }
  }, [address, prevAddress, setFocusedElement])

  return (
    <StyledJoinFormInputField
      className={className}
      layoutRoot
      $disabled={!!disabled}
    >
      <div className="labelGroup">
        {isEther ? (
          <EtherSelect
            name={FIELDS[index]}
            isNative={isNative}
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
        label={availableBalanceLabel}
        maxAmount={maxBalance}
        fiatValue={maxBalanceFiatValue}
      />

      {isEther && (
        <Notice
          activeField={activeField}
          currentField={name}
          formState={formState}
          focusedElement={focusedElement}
          optimizeDisabled={optimizeDisabled}
          joinAmount={value}
        />
      )}
    </StyledJoinFormInputField>
  )
}

export default memo(JoinInputField)
