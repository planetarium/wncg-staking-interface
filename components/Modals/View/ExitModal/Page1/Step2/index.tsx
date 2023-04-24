import { memo, MouseEvent } from 'react'
import {
  Control as ReactHookFormControl,
  UseFormClearErrors,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

import { ExitFormFields } from 'hooks/useExitForm'

import PropExit from './PropExit'
import SingleExit from './SingleExit'

type ExitModalPage1Step2Props = {
  assets: Hash[]
  exitAmounts: string[]
  clearErrors: UseFormClearErrors<ExitFormFields>
  control: ReactHookFormControl<ExitFormFields, 'any'>
  setValue: UseFormSetValue<ExitFormFields>
  setMaxValue(e: MouseEvent<HTMLButtonElement>): void
  singleExitMaxAmounts: string[]
  singleExitTokenOutIndex?: number
  watch: UseFormWatch<ExitFormFields>
  hash?: Hash
  isNativeCurrency: boolean
}

function ExitModalPage1Step2({
  assets,
  exitAmounts,
  clearErrors,
  control,
  setValue,
  setMaxValue,
  singleExitMaxAmounts,
  singleExitTokenOutIndex = 0,
  watch,
  isNativeCurrency,
  hash,
}: ExitModalPage1Step2Props) {
  const exitType = watch('exitType')

  const isProportianl = exitType === null

  if (isProportianl) {
    return (
      <PropExit
        assets={assets}
        exitAmounts={exitAmounts}
        control={control}
        watch={watch}
        hash={hash}
        setValue={setValue}
      />
    )
  }

  return (
    <SingleExit
      clearErrors={clearErrors}
      control={control}
      setMaxValue={setMaxValue}
      singleExitMaxAmounts={singleExitMaxAmounts}
      singleExitTokenOutIndex={singleExitTokenOutIndex}
      watch={watch}
      hash={hash}
      isNativeCurrency={isNativeCurrency}
    />
  )
}

export default memo(ExitModalPage1Step2)
