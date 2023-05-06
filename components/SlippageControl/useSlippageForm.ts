import { MouseEvent, useCallback, useMemo } from 'react'
import {
  Control,
  RegisterOptions,
  UseFormStateReturn,
  useForm,
} from 'react-hook-form'
import { useAtom } from 'jotai'

import { slippageAtom } from 'states/system'
import { MAX_SLIPPAGE } from 'config/misc'
import { bnum } from 'utils/bnum'
import { wait } from 'utils/wait'

export type SlippageControlField = {
  slippage: string
}

export type UseSlippageFormReturn = {
  control: Control<SlippageControlField>
  isCustomValue: boolean
  onSelectSlippage(e: MouseEvent<HTMLButtonElement>): void

  reset(): void
  rules: Omit<
    RegisterOptions<SlippageControlField, 'slippage'>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >
  currentValue: string
  slippageInput: string
  formState: UseFormStateReturn<SlippageControlField>
}

export const SLIPPAGE_TOLERANCES = ['0.5', '1.0', '2.0']

export function useSlippageForm(onCloseMenu: () => void) {
  const [slippage, setSlippage] = useAtom(slippageAtom)
  const currentValue = slippage ?? '0.5'

  const isCustomValue = useMemo(
    () => SLIPPAGE_TOLERANCES.every((option) => !bnum(currentValue).eq(option)),
    [currentValue]
  )

  const { control, setValue, resetField, watch, formState, trigger } =
    useForm<SlippageControlField>({
      mode: 'onChange',
      defaultValues: {
        slippage: isCustomValue ? currentValue : '',
      },
    })

  const slippageInput = bnum(watch('slippage')).toString()

  const rules = useMemo(
    () => ({
      validate: {
        maxAmount: (v: string) =>
          bnum(v).lt(MAX_SLIPPAGE) || `Must be <${MAX_SLIPPAGE}%`,
      },
      onBlur(e: ReactHookFormChangeEvent<'slippage'>) {
        let newSlippage: string | null = e.target.value.replace('%', '')

        if (bnum(newSlippage).isZero()) newSlippage = null
        if (bnum(newSlippage ?? '0').gte(MAX_SLIPPAGE)) newSlippage = null

        setSlippage(newSlippage)
        onCloseMenu()
      },
      onChange(e: ReactHookFormChangeEvent<'slippage'>) {
        const newSlippage = bnum(e.target.value.replace('%', '')).toString()

        setValue('slippage', newSlippage)
        trigger()

        if (bnum(newSlippage).lt(MAX_SLIPPAGE)) {
          setSlippage(newSlippage.toString())
        }
      },
    }),
    [onCloseMenu, setSlippage, setValue, trigger]
  )

  const reset = useCallback(() => {
    resetField('slippage')
  }, [resetField])

  async function onSelectSlippage(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    const newSlippage = bnum(e.currentTarget.value).toString() || null

    resetField('slippage')
    setSlippage(newSlippage)

    await wait(100)

    onCloseMenu()
  }

  return {
    control,
    isCustomValue,
    onSelectSlippage,
    reset,
    rules,
    currentValue,
    slippageInput,
    formState,
  }
}
