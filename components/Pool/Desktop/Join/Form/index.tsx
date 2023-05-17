import { memo, useEffect } from 'react'

import { wait } from 'utils/wait'
import {
  useAuth,
  useBalances,
  useJoinForm,
  useJoinModal,
  useStaking,
} from 'hooks'
import { useFetchUserAllowances } from 'hooks/queries'

import { StyledJoinForm } from './styled'
import {
  Fieldset,
  Summary,
  ProportionalGuideBanner,
  UnoptimizableAlert,
  Footer,
  OptimizedBanner,
} from 'components/Pool/shared'
import Header from './Header'

function JoinForm() {
  const { account, prevAccount } = useAuth()
  const balanceOf = useBalances()
  const { stakedTokenAddress } = useStaking()

  const { refetch } = useFetchUserAllowances()

  const joinFormReturns = useJoinForm()
  const {
    formState,
    assets,
    maxBalances,
    optimized,
    joinAmounts,
    joinAmountsInFiatValue,
    resetFields,
    totalJoinFiatValue,
    optimize,
    optimizeDisabled,
    setValue,
    priceImpact,
    submitDisabled,
    resetDisabled,
    watch,
    focusedElement,
    setFocusedElement,
  } = joinFormReturns

  const _openJoin = useJoinModal(assets, joinAmounts)

  async function openJoin() {
    refetch()
    await wait(50)

    _openJoin({
      assets,
      joinAmounts,
      joinAmountsInFiatValue,
      totalJoinFiatValue,
      bptBalance: balanceOf(stakedTokenAddress),
      resetForm: resetFields,
    })
  }

  useEffect(() => {
    if (account !== prevAccount) {
      resetFields()
    }
  }, [account, prevAccount, resetFields, setFocusedElement])

  return (
    <StyledJoinForm layoutRoot>
      <Header
        optimize={optimize}
        optimized={optimized}
        reset={resetFields}
        resetDisabled={resetDisabled}
        setFocusedElement={setFocusedElement}
      />

      {optimizeDisabled && (
        <UnoptimizableAlert
          assets={assets}
          maxBalances={maxBalances}
          focusedElement={focusedElement}
          optimizeDisabled={optimizeDisabled}
        />
      )}

      <OptimizedBanner optimized={optimized} focusedElement={focusedElement} />

      <ProportionalGuideBanner
        joinAmounts={joinAmounts}
        assets={assets}
        maxBalances={maxBalances}
        formState={formState}
        setValue={setValue}
      />

      <Fieldset {...joinFormReturns} />

      <Summary
        priceImpact={priceImpact}
        totalJoinFiatValue={totalJoinFiatValue}
        setValue={setValue}
        watch={watch}
        formState={formState}
      />

      <Footer
        className="joinFormFooter"
        totalJoinFiatValue={totalJoinFiatValue}
        openJoin={openJoin}
        submitDisabled={submitDisabled}
      />
    </StyledJoinForm>
  )
}

export default memo(JoinForm)
