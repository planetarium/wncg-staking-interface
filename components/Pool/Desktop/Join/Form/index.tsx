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
  ProportionalGuide,
  Unoptimizable,
  Footer,
} from 'components/Pool/shared'
import Header from './Header'

function JoinForm() {
  const { account, isConnected, prevAccount } = useAuth()
  const balanceOf = useBalances()
  const { stakedTokenAddress } = useStaking()

  const { refetch } = useFetchUserAllowances()

  const joinFormReturns = useJoinForm()
  const {
    showAlert,
    formState,
    assets,
    maxBalances,
    hideAlert,
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
      hideAlert()
    }
  }, [account, hideAlert, prevAccount, resetFields])

  return (
    <StyledJoinForm layoutRoot>
      <Header
        optimize={optimize}
        optimized={optimized}
        reset={resetFields}
        resetDisabled={resetDisabled}
      />

      {optimizeDisabled && (
        <Unoptimizable
          assets={assets}
          maxBalances={maxBalances}
          showAlert={showAlert}
        />
      )}

      <Fieldset {...joinFormReturns} />

      <ProportionalGuide
        joinAmounts={joinAmounts}
        assets={assets}
        maxBalances={maxBalances}
        formState={formState}
        setValue={setValue}
      />

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
