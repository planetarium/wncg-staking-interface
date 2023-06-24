import { MouseEvent, useMemo } from 'react'
import { UseFormSetValue, UseFormTrigger } from 'react-hook-form'

import { LiquidityFieldType } from 'config/constants'
import { useChain, useStaking } from 'hooks'
import { JoinPoolForm } from 'hooks/balancer/useJoinForm'

import { StyledJoinFormEtherSelect } from './styled'
import Dropdown from 'components/Dropdown'

type JoinFormEtherSelectProps = {
  name: LiquidityFieldType
  isNative: boolean
  setValue: UseFormSetValue<JoinPoolForm>
  trigger: UseFormTrigger<JoinPoolForm>
}

export default function JoinFormEtherSelect({
  name,
  isNative,
  setValue,
  trigger,
}: JoinFormEtherSelectProps) {
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
      LiquidityFieldType.UseNative,
      symbol === nativeCurrency.symbol ? true : false
    )
    setValue(name as 'TokenA' | 'TokenB', '')
    trigger()
  }

  return (
    <StyledJoinFormEtherSelect>
      <Dropdown
        id="joinForm:etherSelect"
        onChange={onSelectEtherType}
        value={selectedToken}
        list={list}
      />
    </StyledJoinFormEtherSelect>
  )
}
