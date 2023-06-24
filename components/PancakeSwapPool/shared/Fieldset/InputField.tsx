import { memo, useCallback, useMemo } from 'react'
import {
  Control as ReactHookFormControl,
  FieldValues,
  UseFormClearErrors,
  UseFormSetValue,
  UseFormTrigger,
  UseFormStateReturn,
  UseFormWatch,
} from 'react-hook-form'
import clsx from 'clsx'

import { useAuth, useChain, useFiat } from 'hooks'
import config from 'config'
import { LiquidityFieldType } from 'config/constants'
import { bnum } from 'utils/bnum'
import { wait } from 'utils/wait'
import { useAddLiquidityMath } from 'hooks/pancakeswap'
import type {
  AddLiquidityForm,
  AddLiquidityFormElement,
} from 'hooks/pancakeswap/useAddLiquidityForm'

import { StyledAddLiquidityFormInputField } from './styled'
import { AvailableBalance, Control } from 'components/Form'
import Notice from './Notice'

type AddLiquidityFormInputFieldProps = {
  index: number
  activeField: AddLiquidityField | null
  className?: string
  clearErrors: UseFormClearErrors<AddLiquidityForm>
  control: ReactHookFormControl<AddLiquidityForm>
  disabled?: boolean
  focusedElement: AddLiquidityFormElement
  formState: UseFormStateReturn<AddLiquidityForm>
  maxBalance: string
  maxSafeBalance: string
  name: 'TokenA' | 'TokenB'
  resetFields(): void
  setActiveField(field: 'TokenA' | 'TokenB'): void
  setFocusedElement(value: AddLiquidityFormElement): void
  setValue: UseFormSetValue<AddLiquidityForm>
  subjectFieldName: 'TokenA' | 'TokenB'
  token: TokenInfo
  trigger: UseFormTrigger<AddLiquidityForm>
  value: string
  watch: UseFormWatch<AddLiquidityForm>
  optimizeDisabled: boolean
}

function AddLiquidityFormInputField({
  index,
  activeField,
  className,
  control,
  focusedElement,
  formState,
  maxBalance,
  maxSafeBalance,
  name,
  resetFields,
  setActiveField,
  setFocusedElement,
  setValue,
  subjectFieldName,
  token,
  trigger,
  value,
  watch,
  optimizeDisabled,
}: AddLiquidityFormInputFieldProps) {
  const { isConnected } = useAuth()
  const { nativeCurrency } = useChain()
  const toFiat = useFiat()
  const { address, decimals, symbol } = token
  const { calcPropAmountIn } = useAddLiquidityMath()

  const id = useMemo(() => `addLiquidityForm:InputField:${address}`, [address])
  const availableBalanceLabel = useMemo(
    () => `${symbol} in my wallet`,
    [symbol]
  )

  const maxBalanceInFiatValue = useMemo(
    () => toFiat(maxBalance, address),
    [address, maxBalance, toFiat]
  )

  const rules = useMemo(
    () => ({
      validate: {
        maxAmount: (v: string) => {
          if (bnum(v).lte(maxBalance)) return true
          return activeField === name
            ? `Exceeds wallet balance`
            : `Not enough ${symbol} to match the pool ratio`
        },
      },
      async onChange(event: ReactHookFormChangeEvent<LiquidityFieldType>) {
        setFocusedElement('Input')

        if (activeField !== name) setActiveField(name)

        if (event.target.value === '') {
          resetFields()
          return
        }

        const bNewAmount = bnum(event.target.value)
        if (bNewAmount.isNaN()) return

        const subjectAmount = await calcPropAmountIn(
          bnum(event.target.value).toString(),
          1 - index
        )

        setValue(subjectFieldName, subjectAmount!)
        await wait(50)
        trigger(subjectFieldName)
      },
    }),
    [
      maxBalance,
      activeField,
      name,
      symbol,
      setFocusedElement,
      setActiveField,
      calcPropAmountIn,
      index,
      setValue,
      subjectFieldName,
      trigger,
      resetFields,
    ]
  )

  const setMaxValue = useCallback(async () => {
    setActiveField(name)
    setValue(name, maxSafeBalance)

    const subjectAmount = await calcPropAmountIn(
      bnum(maxSafeBalance).toString(),
      1 - index
    )

    setValue(subjectFieldName, subjectAmount!)

    setFocusedElement('Max')
    trigger()
  }, [
    calcPropAmountIn,
    index,
    maxSafeBalance,
    name,
    setActiveField,
    setFocusedElement,
    setValue,
    subjectFieldName,
    trigger,
  ])

  const isNative = token.address === nativeCurrency.address

  const disabled = !isConnected

  const showMisc =
    activeField &&
    activeField !== name &&
    (focusedElement === 'Input' || focusedElement === 'Max') &&
    bnum(watch(name)).gt(0)

  return (
    <StyledAddLiquidityFormInputField
      className={className}
      layoutRoot
      $disabled={disabled}
    >
      <div className="labelGroup">
        <label className="label" htmlFor={id}>
          {symbol}

          <span
            className={clsx('misc parenthesis', {
              active: showMisc,
            })}
          >
            updated to match the pool ratio
          </span>
        </label>
        <span className="weight parenthesis">50%</span>
      </div>

      <Control<'number'>
        id={id}
        address={token.address}
        control={control as unknown as ReactHookFormControl<FieldValues>}
        name={name}
        rules={rules}
        maxAmount={maxBalance}
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
        fiatValue={maxBalanceInFiatValue}
      />

      {isNative && (
        <Notice
          activeField={activeField}
          currentField={name}
          formState={formState}
          focusedElement={focusedElement}
          joinAmount={value}
          optimizeDisabled={optimizeDisabled}
        />
      )}
    </StyledAddLiquidityFormInputField>
  )
}

export default memo(AddLiquidityFormInputField)
