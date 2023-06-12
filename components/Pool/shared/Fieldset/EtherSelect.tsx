import { MouseEvent, useMemo } from 'react'
import { UseFormSetValue, UseFormTrigger } from 'react-hook-form'

import { LiquidityFieldType } from 'config/constants'
import { useChain, useStaking } from 'hooks'
import { JoinFormFields } from 'hooks/useJoinForm'

import { StyledJoinFormJoinFormEtherSelect } from './styled'
import Dropdown from 'components/Dropdown'

type JoinFormEtherSelectProps = {
  name: LiquidityFieldType
  isNativeCurrency: boolean
  setValue: UseFormSetValue<JoinFormFields>
  trigger: UseFormTrigger<JoinFormFields>
}

export default function JoinFormEtherSelect({
  name,
  isNativeCurrency,
  setValue,
  trigger,
}: JoinFormEtherSelectProps) {
  const { nativeCurrency } = useChain()
  const { tokens } = useStaking()

  const wrappedToken = tokens[nativeCurrency.wrappedTokenAddress]
  const selectedToken = isNativeCurrency
    ? nativeCurrency.symbol
    : wrappedToken.symbol

  const list = useMemo(
    () => [nativeCurrency.symbol, wrappedToken.symbol],
    [nativeCurrency.symbol, wrappedToken.symbol]
  )

  function onSelectEtherType(e: MouseEvent) {
    const { value: symbol } = e.currentTarget as HTMLButtonElement

    setValue(
      'isNativeCurrency',
      symbol === nativeCurrency.symbol ? true : false
    )
    setValue(name as 'TokenA' | 'TokenB', '')
    trigger()
  }

  return (
    <StyledJoinFormJoinFormEtherSelect>
      <Dropdown
        id="joinForm:etherSelect"
        onChange={onSelectEtherType}
        value={selectedToken}
        list={list}
      />
    </StyledJoinFormJoinFormEtherSelect>
  )
}
