import { useAtomValue, useSetAtom } from 'jotai'
import { useFiat, useModal, useStaking } from 'hooks'

import { unstakeTxAtom } from 'states/tx'
import { showMyStakingAtom } from 'states/ui'
import { bnum } from 'utils/bnum'

import { StyledUnstakeModalPage3 } from './styled'
import Button from 'components/Button'
import CountUp from 'components/CountUp'
import NumberFormat from 'components/NumberFormat'

export default function UnstakeModalPage3() {
  const toFiat = useFiat()
  const { removeModal } = useModal()
  const { lpToken } = useStaking()

  const { unstakeAmount = '0', stakedTokenBalance = '0' } =
    useAtomValue(unstakeTxAtom)
  const setShowMyStaking = useSetAtom(showMyStakingAtom)

  const stakedTokenBalanceInFiatValue = toFiat(
    stakedTokenBalance,
    lpToken?.address
  )

  const totalStakedTokenBalance = bnum(stakedTokenBalance)
    .minus(unstakeAmount)
    .toString()

  const totalStakedTokenBalanceInFiatValue = toFiat(
    totalStakedTokenBalance,
    lpToken?.address
  )

  const unstakeAmountInFiatValue = toFiat(unstakeAmount, lpToken?.address)

  function closeModal() {
    removeModal()
    setShowMyStaking(true)
  }

  return (
    <StyledUnstakeModalPage3>
      <header className="modalHeader">
        <h2 className="title">Withdraw completed!</h2>
      </header>

      <div className="container">
        <div className="modalContent">
          <dl className="detailList">
            <div className="detailItem">
              <dt>Before withdrawal</dt>
              <dd>
                <NumberFormat value={stakedTokenBalance} decimals={8} />

                <NumberFormat
                  className="usd"
                  value={stakedTokenBalanceInFiatValue}
                  type="fiat"
                />
              </dd>
            </div>

            <div className="detailItem accent">
              <dt>Withdraw</dt>

              <dd>
                <NumberFormat value={unstakeAmount} minus decimals={8} />

                <NumberFormat
                  className="usd"
                  value={unstakeAmountInFiatValue}
                  type="fiat"
                />
              </dd>
            </div>

            <div className="detailItem total">
              <dt>My total staked LP</dt>
              <dd>
                <CountUp value={totalStakedTokenBalance} decimals={8} />

                <NumberFormat
                  className="usd"
                  value={totalStakedTokenBalanceInFiatValue}
                  type="fiat"
                />
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <footer className="modalFooter">
        <Button type="button" onClick={closeModal} $size="md">
          Close
        </Button>
      </footer>
    </StyledUnstakeModalPage3>
  )
}
