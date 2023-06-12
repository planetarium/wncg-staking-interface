import { wait } from 'utils/wait'
import { useBalances, useJoinModal, useStaking } from 'hooks'
import { useFetchUserAllowances } from 'hooks/queries'
import { UseJoinFormReturns } from 'hooks/useJoinForm'

import { Footer, Summary } from 'components/Pool/shared'
import Form from './Form'

type PoolMobileContentProps = UseJoinFormReturns

export default function PoolMobileContent(props: PoolMobileContentProps) {
  const balanceOf = useBalances()
  const { lpToken } = useStaking()

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
