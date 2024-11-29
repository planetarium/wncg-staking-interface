import {
  Control as ReactHookFormControl,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

import { ExitFormFields } from 'hooks/balancer/useExitForm'

import Proportional from './Proportional'

type ExitModalPage1Step2Props = {
  control: ReactHookFormControl<ExitFormFields, 'any'>
  setValue: UseFormSetValue<ExitFormFields>
  watch: UseFormWatch<ExitFormFields>
  hash?: Hash
}

function ExitModalPage1Step2({
  control,
  watch,
  setValue,
  hash,
}: ExitModalPage1Step2Props) {
  return (
    <Proportional
      control={control}
      watch={watch}
      setValue={setValue}
      hash={hash}
    />
  )
}

export default ExitModalPage1Step2
