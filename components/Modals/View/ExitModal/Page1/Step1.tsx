import { useMemo } from 'react'
import {
  Control,
  Controller,
  UseFormResetField,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'
import clsx from 'clsx'

import config from 'config'
import { LiquidityFieldType } from 'config/constants'
import { useStaking } from 'hooks'
import { ExitFormFields } from 'hooks/useExitForm'

import { StyledExitModalPage1Step1 } from './styled'
import TokenIcon from 'components/TokenIcon'

type ExitModalPage1Step1Props = {
  control: Control<ExitFormFields>
  watch: UseFormWatch<ExitFormFields>
  setValue: UseFormSetValue<ExitFormFields>
  resetField: UseFormResetField<ExitFormFields>
  hash?: Hash
}

function ExitModalPage1Step1({
  control,
  watch,
  setValue,
  resetField,
  hash,
}: ExitModalPage1Step1Props) {
  const {
    poolTokenAddresses,
    shouldReversePoolTokenOrder,
    stakedTokenAddress,
    tokenMap,
  } = useStaking()

  const exitType = watch('exitType')

  const exitTypeList = useMemo(() => {
    if (shouldReversePoolTokenOrder) {
      return [null, ...poolTokenAddresses, config.nativeCurrency.address]
    }

    return [null, ...poolTokenAddresses, config.nativeCurrency.address]
  }, [poolTokenAddresses, shouldReversePoolTokenOrder])

  const disabled = !!hash

  const rules = {
    required: true,
    onChange(e: any) {
      if (disabled) return
      if (!e.target.value) setValue('exitType', null)
      resetField(LiquidityFieldType.ExitAmount)
      resetField(LiquidityFieldType.LiquidityPercent)
    },
  }

  return (
    <StyledExitModalPage1Step1 $disabled={disabled}>
      <header className="header">
        <span className="count">1</span>
        <h4 className="title">Choose a coin to exit pool</h4>
      </header>

      <fieldset className="tokenGroup">
        <Controller
          name="exitType"
          control={control}
          rules={rules}
          render={({ field }: ControlRendererProps<ExitFormFields>) => (
            <>
              {exitTypeList.map((addr) => {
                const key = `exitForm:exitType:${addr}`
                const label = addr === null ? 'All' : tokenMap[addr].symbol

                return (
                  <div
                    className={clsx('tokenButton', {
                      selected: exitType === addr,
                      disabled,
                    })}
                    key={key}
                  >
                    <label className="fakeInput" htmlFor={key}>
                      <TokenIcon
                        key={`exitForm:tokenGroup:${
                          addr ?? stakedTokenAddress
                        }`}
                        address={addr ?? stakedTokenAddress}
                        $size={24}
                      />

                      <span className="label">{label}</span>
                    </label>

                    <input
                      {...field}
                      id={key}
                      type="radio"
                      value={addr ?? undefined}
                      defaultChecked={exitType === addr}
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
