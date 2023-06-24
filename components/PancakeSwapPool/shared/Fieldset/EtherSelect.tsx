import { MouseEvent, useMemo } from 'react'
import { UseFormSetValue, UseFormTrigger } from 'react-hook-form'

import { AddLiquidityField } from 'config/constants'
import { useChain, useStaking } from 'hooks'
import { AddLiquidityForm } from 'hooks/pancakeswap/useAddLiquidityForm'

import { StyledAddLiquidityFormAddLiquidityFormEtherSelect } from './styled'
import Dropdown from 'components/Dropdown'

type AddLiquidityFormEtherSelectProps = {
  name: AddLiquidityField
  isNative: boolean
  setValue: UseFormSetValue<AddLiquidityForm>
  trigger: UseFormTrigger<AddLiquidityForm>
}

export default function AddLiquidityFormEtherSelect({
  name,
  isNative,
  setValue,
  trigger,
}: AddLiquidityFormEtherSelectProps) {
  const { nativeCurrency } = useChain()
  const { tokens } = useStaking()

  const wrappedToken = tokens[nativeCurrency.wrappedTokenAddress]
  const selectedToken = isNative ? nativeCurrency.symbol : wrappedToken.symbol

  const list = useMemo(
    () => [nativeCurrency.symbol, wrappedToken.symbol],
    [nativeCurrency.symbol, wrappedToken.symbol]
  )

  function onSelectEtherType(e: MouseEvent) {
    const { value: symbol } = e.currentTarget as HTMLButtonElement

    setValue(
      AddLiquidityField.UseNative,
      symbol === nativeCurrency.symbol ? true : false
    )
    setValue(name as 'TokenA' | 'TokenB', '')
    trigger()
  }

  return (
    <StyledAddLiquidityFormAddLiquidityFormEtherSelect>
      <Dropdown
        id="addLiquidityForm:etherSelect"
        onChange={onSelectEtherType}
        value={selectedToken}
        list={list}
      />
    </StyledAddLiquidityFormAddLiquidityFormEtherSelect>
  )
}
