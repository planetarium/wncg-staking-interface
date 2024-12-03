import { MouseEvent, useCallback, useMemo } from 'react'
import {
  Control,
  RegisterOptions,
  UseFormStateReturn,
  useForm,
} from 'react-hook-form'
import { useAtom } from 'jotai'

import { slippageAtom } from 'states/system'
import { MAX_SLIPPAGE, MIN_SLIPPAGE } from 'config/constants/liquidityPool'
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
        minAmount: (v: string) =>
          bnum(v).isZero() ||
          bnum(v).gte(MIN_SLIPPAGE) ||
          `Slippage is too low`,
      },
      onBlur(e: ReactHookFormChangeEvent<'slippage'>) {
        let newSlippage: string | null = e.target.value.replace('%', '')

        if (bnum(newSlippage).isZero()) newSlippage = null

        if (bnum(newSlippage).gte(MAX_SLIPPAGE)) newSlippage = null
        if (bnum(newSlippage).lt(MIN_SLIPPAGE)) newSlippage = null
        if (newSlippage) {
          setSlippage(bnum(newSlippage).toFixed(2) as `${number}`)
        } else {
          setSlippage(null)
        }

        onCloseMenu()
      },
      onChange(e: ReactHookFormChangeEvent<'slippage'>) {
        const newSlippage = bnum(e.target.value.replace('%', '')).toString()

        setValue('slippage', newSlippage)
        trigger()

        if (
          bnum(newSlippage).lt(MAX_SLIPPAGE) &&
          bnum(newSlippage).gte(MIN_SLIPPAGE)
        ) {
          setSlippage(bnum(newSlippage).toFixed(2) as `${number}`)
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
    setSlippage(newSlippage as `${number}`)

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
