import { wait } from 'utils/wait'
import { useBalances, useJoinModal, useStaking } from 'hooks'
import { poolUrlFor } from 'utils/poolUrlFor'
import { useFetchUserAllowances } from 'hooks/queries'
import { UseJoinFormReturns } from 'hooks/useJoinForm'

import { Footer, Summary } from 'components/Pool/shared'
import Form from './Form'
import Link from 'next/link'
import Icon from 'components/Icon'

type PoolMobileContentProps = UseJoinFormReturns

export default function PoolMobileContent(props: PoolMobileContentProps) {
  const balanceOf = useBalances()
  const { stakedTokenAddress } = useStaking()

  const { refetch } = useFetchUserAllowances()

  const {
    assets,
    joinAmounts,
    joinAmountsInFiatValue,
    resetFields,
    totalJoinFiatValue,
    priceImpact,
    submitDisabled,
    setValue,
    watch,
    formState,
  } = props

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

  return (
    <>
      <div className="container">
        <div className="modalContent">
          <Form {...props} />

          <div className="poolInfo">
            <h5>Pool information</h5>

            <Link className="linkButton" target="_blank" href={poolUrlFor()}>
              detail
              <Icon icon="outlink" />
            </Link>
          </div>

          <Summary
            totalJoinFiatValue={totalJoinFiatValue}
            priceImpact={priceImpact}
            setValue={setValue}
            watch={watch}
            formState={formState}
          />
        </div>
      </div>

      <Footer
        className="modalFooter"
        totalJoinFiatValue={totalJoinFiatValue}
        openJoin={openJoin}
        submitDisabled={submitDisabled}
      />
    </>
  )
}
