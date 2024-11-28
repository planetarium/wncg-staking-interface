import {
  Control as ReactHookFormControl,
  UseFormClearErrors,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form'

import { ExitFormFields } from 'hooks/balancer/useExitForm'

import Proportional from './Proportional'
import ExactOutExit from './ExactOutExit'

type ExitModalPage1Step2Props = {
  clearErrors: UseFormClearErrors<ExitFormFields>
  control: ReactHookFormControl<ExitFormFields, 'any'>
  setValue: UseFormSetValue<ExitFormFields>
  trigger: UseFormTrigger<ExitFormFields>
  watch: UseFormWatch<ExitFormFields>
  singleExitMaxAmounts: string[]
  hash?: Hash
  isNative: boolean
}

function ExitModalPage1Step2({
  clearErrors,
  control,
  watch,
  setValue,
  trigger,
  singleExitMaxAmounts,
  hash,
}: ExitModalPage1Step2Props) {
  const exitType = watch('exitType')

  const isGivenIn = exitType === null

  if (isGivenIn) {
    return (
      <Proportional
        control={control}
        watch={watch}
        setValue={setValue}
        hash={hash}
      />
    )
  }

  return (
    <ExactOutExit
      control={control}
      watch={watch}
      clearErrors={clearErrors}
      setValue={setValue}
      trigger={trigger}
      singleExitMaxAmounts={singleExitMaxAmounts}
      hash={hash}
    />
  )
}

export default ExitModalPage1Step2
