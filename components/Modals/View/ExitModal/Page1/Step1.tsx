import clsx from 'clsx'
import { useMemo } from 'react'
import { Control, Controller, UseFormWatch } from 'react-hook-form'

import { useChain, useStaking } from 'hooks'
import { ExitFormFields } from 'hooks/balancer/useExitForm'

import TokenIcon from 'components/TokenIcon'
import { StyledExitModalPage1Step1 } from './styled'

type ExitModalPage1Step1Props = {
  control: Control<ExitFormFields>
  watch: UseFormWatch<ExitFormFields>
  hash?: Hash
}

function ExitModalPage1Step1({
  control,
  watch,
  hash,
}: ExitModalPage1Step1Props) {
  const { tokens } = useStaking()

  const { nativeCurrency } = useChain()

  const useNative = watch('UseNative')

  const addressList = useMemo(() => {
    return [nativeCurrency.address, nativeCurrency.wrappedTokenAddress]
  }, [nativeCurrency])

  const disabled = !!hash

  return (
    <StyledExitModalPage1Step1 $disabled={disabled}>
      <header className="header">
        <span className="count">1</span>
        <h4 className="title">Choose a coin to exit pool</h4>
      </header>

      <fieldset className="tokenGroup">
        <Controller
          name="UseNative"
          control={control}
          render={({
            field: { onChange, ...field },
          }: ControlRendererProps<ExitFormFields>) => (
            <>
              {addressList.map((address) => {
                const isNative = address === nativeCurrency.address
                const key = `exitForm:useNative:${isNative}`
                const label = tokens?.[address]?.symbol
                const selected =
                  (isNative && useNative) || (!isNative && !useNative)

                return (
                  <div
                    className={clsx('tokenButton', { selected, disabled })}
                    key={key}
                  >
                    <label className="fakeInput" htmlFor={key}>
                      <TokenIcon
                        key={`exitForm:tokenGroup:${address}`}
                        address={nativeCurrency.address}
                        $size={24}
                      />
                      <span className="label">{label}</span>
                    </label>
                    <input
                      {...field}
                      id={key}
                      type="radio"
                      value={isNative.toString()}
                      onChange={({ target: { value } }) =>
                        onChange(value === 'true' ? true : false)
                      }
                      disabled={disabled}
                    />
                  </div>
                )
              })}
            </>
          )}
        />
      </fieldset>
    </StyledExitModalPage1Step1>
  )
}

export default ExitModalPage1Step1
