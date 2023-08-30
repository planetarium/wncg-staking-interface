import { atom, useSetAtom } from 'jotai'
import {
  UseFormSetValue,
  UseFormStateReturn,
  UseFormWatch,
} from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'

import { HIGH_PRICE_IMPACT } from 'config/constants/liquidityPool'
import { ExitFormFields, priceImpactAtom } from 'hooks/balancer/useExitForm'
import { bnum } from 'utils/bnum'

import { StyledExitModalPage1Step3 } from './styled'
import HighPriceImpact from 'components/HighPriceImpact'
import NumberFormat from 'components/NumberFormat'
import RektPriceImpact from 'components/RektPriceImpact'
import { LiquidityFieldType } from 'config/constants'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { useExactOutExit } from 'hooks/balancer'
import { useChain, useStaking } from 'hooks'
import { ExitQueryOutput } from 'lib/balancer/types'
import { isSameAddress } from '@balancer-labs/sdk'

type ExitModalPage1Step3Props = {
  hash?: Hash
  setValue: UseFormSetValue<ExitFormFields>
  watch: UseFormWatch<ExitFormFields>
  formState: UseFormStateReturn<ExitFormFields>
  singleExitMaxAmounts: string[]
  tokenOutIndex: number
}

function ExitModalPage1Step3({
  hash,
  setValue,
  watch,
  formState,
  singleExitMaxAmounts,
  tokenOutIndex,
}: ExitModalPage1Step3Props) {
  const { chainId, nativeCurrency } = useChain()
  const { tokens } = useStaking()

  let tokenOutAddress = watch('exitType')!
  if (tokenOutAddress && isSameAddress(tokenOutAddress, nativeCurrency.address))
    tokenOutAddress = nativeCurrency.wrappedTokenAddress

  const _amountOut = watch(LiquidityFieldType.ExitAmount)

  const tokenOut = tokens[tokenOutAddress]
  const amountOut = bnum(_amountOut).toString()
  const maxAmountOut = singleExitMaxAmounts[tokenOutIndex] ?? '0'

  const setPriceImpact = useSetAtom(priceImpactAtom)

  const { queryExactOutExit } = useExactOutExit()

  const { data = {} as ExitQueryOutput } = useQuery(
    [
      QUERY_KEYS.Balancer.ExactOutExitPriceImpact,
      chainId,
      tokenOutAddress,
      amountOut,
    ],
    () => queryExactOutExit(tokenOut, amountOut),
    {
      staleTime: 60 * 1_000,
      useErrorBoundary: false,
      enabled: bnum(amountOut).lte(maxAmountOut),
      onSuccess(data) {
        setPriceImpact(String(data.priceImpact))
      },
    }
  )

  const bPriceImpact = bnum(data?.priceImpact ?? 0)

  const priceImpactPcnt = bPriceImpact.times(100).toFixed(2)
  const priceImpactAgreement = watch('priceImpactAgreement') ?? false

  function toggle() {
    setValue('priceImpactAgreement', !priceImpactAgreement)
  }

  const showAlert = bnum(data?.priceImpact ?? 0).gt(HIGH_PRICE_IMPACT)
  const hasError = Object.keys(formState.errors).length > 0

  return (
    <StyledExitModalPage1Step3 $disabled={!!hash}>
      <header className="header">
        <span className="count">3</span>
        <h4 className="title">Check price impact</h4>

        {/* {hasError ? (
          <span className="pcnt alert">100%</span>
        ) : (
          <NumberFormat
            className={clsx('pcnt', { alert: showAlert })}
            value={priceImpactPcnt}
            type="percent"
          />
        )} */}
        <NumberFormat
          className={clsx('pcnt', { alert: showAlert })}
          value={priceImpactPcnt}
          type="percent"
        />
      </header>

      {!hasError && (
        <HighPriceImpact
          checked={priceImpactAgreement}
          priceImpact={bPriceImpact.toString()}
          toggle={toggle}
          disabled={!!hash}
        />
      )}

      <RektPriceImpact
        action="exit"
        priceImpact={bPriceImpact.toString()}
        disabled={!!hash}
      />
    </StyledExitModalPage1Step3>
  )
}

export default ExitModalPage1Step3
