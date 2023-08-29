import { useCallback, useMemo } from 'react'
import { Control as ReactHookFormControl, FieldValues } from 'react-hook-form'
import clsx from 'clsx'

import { useAuth, useChain, useFiat } from 'hooks'
import { LiquidityFieldType } from 'config/constants'
import { bnum } from 'utils/bnum'
import { wait } from 'utils/wait'
import { useMintMath } from 'hooks/pancakeswap'
import {
  FIELDS,
  UseAddLiquidityFormReturns,
} from 'hooks/pancakeswap/useAddLiquidityForm'

import { StyledAddLiquidityFormInputField } from './styled'
import { AvailableBalance, Control } from 'components/Form'
import EtherSelect from './EtherSelect'
import Notice from './Notice'

type AddLiquidityFormInputFieldProps = {
  index: number
  token: TokenInfo
  name: 'TokenA' | 'TokenB'
  value: string
  className?: string
} & UseAddLiquidityFormReturns

function AddLiquidityFormInputField({
  index,
  isNative,
  activeField,
  className,
  optimizeDisabled,
  control,
  focusedElement,
  formState,
  maxBalances,
  maxSafeBalances,
  name,
  resetFields,
  setActiveField,
  setFocusedElement,
  setIndependentField,
  setValue,
  token,
  trigger,
  value,
  watch,
}: AddLiquidityFormInputFieldProps) {
  const { isConnected } = useAuth()
  const { nativeCurrency } = useChain()
  const toFiat = useFiat()
  const calcPropAmountIn = useMintMath()

  const { address, decimals, symbol } = token

  const id = useMemo(() => `addLiquidityForm:InputField:${address}`, [address])
  const availableBalanceLabel = useMemo(
    () => `${symbol} in my wallet`,
    [symbol]
  )

  const subjectFieldName = FIELDS[1 - index]

  const maxBalance = maxBalances[index]
  const maxSafeBalance = maxSafeBalances[index]

  const maxBalanceFiatValue = useMemo(
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

        if (activeField !== name) {
          setActiveField(name)
          setIndependentField(name)
        }

        if (event.target.value === '') {
          return
        }

        const bNewAmount = bnum(event.target.value)
        if (bNewAmount.isNaN()) return

        const subjectAmount = await calcPropAmountIn(
          name,
          bNewAmount.toString()
        )

        setValue(subjectFieldName, subjectAmount?.toSignificant() ?? '0')

        await wait(50)
        trigger(subjectFieldName)
      },
    }),
    [
      activeField,
      calcPropAmountIn,
      maxBalance,
      name,
      resetFields,
      setActiveField,
      setFocusedElement,
      setIndependentField,
      setValue,
      subjectFieldName,
      symbol,
      trigger,
    ]
  )

  const setMaxValue = useCallback(async () => {
    setActiveField(name)

    const subjectAmount = await calcPropAmountIn(name, maxSafeBalance)

    setFocusedElement('Max')
    setValue(name, maxSafeBalance)
    setValue(
      subjectFieldName,
      bnum(subjectAmount?.toSignificant() ?? '0').toString()!
    )

    trigger()
  }, [
    calcPropAmountIn,
    maxSafeBalance,
    name,
    setActiveField,
    setFocusedElement,
    setValue,
    subjectFieldName,
    trigger,
  ])

  const isEther = [
    nativeCurrency.wrappedTokenAddress,
    nativeCurrency.address,
  ].includes(address)

  const disabled = !isConnected

  const showMisc =
    activeField &&
    activeField !== name &&
    value !== '' &&
    ((focusedElement === 'Input' && bnum(watch(name)).gt(0)) ||
      focusedElement === 'Max')

  return (
    <StyledAddLiquidityFormInputField
      className={className}
      layoutRoot
      $disabled={disabled}
    >
      <div className="labelGroup">
        {isEther ? (
          <div className="selectGroup">
            <EtherSelect
              name={FIELDS[index]}
              isNative={isNative}
              setFocusedElement={setFocusedElement}
              setValue={setValue}
              trigger={trigger}
            />
            <span
              className={clsx('misc parenthesis', {
                active: showMisc,
              })}
            >
              amount updated to match the pool ratio
            </span>
          </div>
        ) : (
          <label className="label" htmlFor={id}>
            {symbol}

            <span
              className={clsx('misc parenthesis', {
                active: showMisc,
              })}
            >
              amount updated to match the pool ratio
            </span>
          </label>
        )}

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
        label={availableBalanceLabel}
        maxAmount={maxBalance}
        fiatValue={maxBalanceFiatValue}
      />

      {isNative && isEther && (
        <Notice
          activeField={activeField}
          currentField={name}
          formState={formState}
          focusedElement={focusedElement}
          amountIn={value}
          optimizeDisabled={optimizeDisabled}
        />
      )}
    </StyledAddLiquidityFormInputField>
  )
}

export default AddLiquidityFormInputField
