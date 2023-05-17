import { MouseEvent, useMemo } from 'react'
import { UseFormSetValue, UseFormTrigger } from 'react-hook-form'

import config from 'config'
import { LiquidityFieldType } from 'config/constants'
import { useStaking } from 'hooks'
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
  const { tokenMap } = useStaking()
  const wrappedToken = tokenMap[config.weth]

  const selectedToken = isNativeCurrency
    ? config.nativeCurrency.symbol
    : wrappedToken.symbol

  const list = useMemo(
    () => [config.nativeCurrency.symbol, wrappedToken.symbol],
    [wrappedToken.symbol]
  )

  function onSelectEtherType(e: MouseEvent) {
    const { value: symbol } = e.currentTarget as HTMLButtonElement

    setValue(
      'isNativeCurrency',
      symbol === config.nativeCurrency.symbol ? true : false
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
