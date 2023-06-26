import { wait } from 'utils/wait'
import { useBalances, useStaking } from 'hooks'
import { useJoinModal } from 'hooks/balancer'
import { UseJoinFormReturns } from 'hooks/balancer/useJoinForm'
import { useFetchUserAllowances } from 'hooks/queries'

import { Footer, Summary } from 'components/BalancerPool/shared'
import Form from './Form'

type BalancerPoolMobileContentProps = UseJoinFormReturns

export default function BalancerPoolMobileContent(
  props: BalancerPoolMobileContentProps
) {
  const balanceOf = useBalances()
  const { lpToken } = useStaking()

  const { refetch } = useFetchUserAllowances()

  const {
    assets,
    joinAmounts,
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
      totalJoinFiatValue,
      lpBalance: balanceOf(lpToken.address),
      resetForm: resetFields,
    })
  }

  return (
    <>
      <div className="container">
        <div className="modalContent">
          <Form {...props} />

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
