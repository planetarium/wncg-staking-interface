import { memo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import { stakeTxAtom } from 'states/tx'
import { showMyStakingAtom } from 'states/ui'
import { bnum } from 'utils/bnum'
import { useFiat, useModal, useStaking } from 'hooks'

import { StyledStakeModalPage2 } from './styled'
import Button from 'components/Button'
import CountUp from 'components/CountUp'
import Lottie from 'components/Lottie'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'

type StakeModalPage2Props = {
  resetForm(): void
}

function StakeModalPage2({ resetForm }: StakeModalPage2Props) {
  const toFiat = useFiat()
  const { removeModal } = useModal()
  const { bptName, stakedTokenAddress } = useStaking()

  const { stakeAmount = '0', stakedTokenBalance = '0' } =
    useAtomValue(stakeTxAtom)
  const setShowMyStaking = useSetAtom(showMyStakingAtom)

  const hasStakedBefore = bnum(stakedTokenBalance).gt(0)

  const totalStakedTokenBalance = bnum(stakeAmount)
    .plus(stakedTokenBalance)
    .toString()

  const stakedAmountInFiatValue = toFiat(stakeAmount, stakedTokenAddress)
  const stakedTokenBalanceInFiatValue = toFiat(
    stakedTokenBalance,
    stakedTokenAddress
  )
  const totalStakedTokenBalanceInFiatValue = toFiat(
    totalStakedTokenBalance,
    stakedTokenAddress
  )

  function closeModal() {
    removeModal()
    resetForm()
    setShowMyStaking(true)
  }

  return (
    <StyledStakeModalPage2>
      <header className="modalHeader">
        <Lottie className="confetti" animationData="success" />
        <div className="tokenSymbol">
          <TokenIcon address={stakedTokenAddress} $size={16} />
          LP token({bptName})
        </div>
        <h2 className="title">Staking completed!</h2>
      </header>

      <div className="container">
        <div className="modalContent">
          <dl className="detailList">
            {hasStakedBefore && (
              <div className="detailItem">
                <dt>Already staked</dt>
                <dd>
                  <NumberFormat value={stakedTokenBalance} decimals={8} />

                  <span className="fiatValue">
                    <NumberFormat
                      value={stakedTokenBalanceInFiatValue}
                      type="fiat"
                      prefix="$"
                    />
                  </span>
                </dd>
              </div>
            )}

            <div className="detailItem accent">
              <dt>Staked LP tokens</dt>

              <dd>
                <NumberFormat value={stakeAmount} plus decimals={8} />
                <span className="fiatValue">
                  <NumberFormat
                    value={stakedAmountInFiatValue}
                    type="fiat"
                    prefix="$"
                  />
                </span>
              </dd>
            </div>

            <div className="detailItem total">
              <dt>My total staked LP</dt>
              <dd>
                <CountUp value={totalStakedTokenBalance} decimals={8} />

                <NumberFormat
                  className="fiatValue"
                  value={totalStakedTokenBalanceInFiatValue}
                  type="fiat"
                  prefix="$"
                />
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <footer className="modalFooter">
        <Button onClick={closeModal} $size="md">
          Go to main
        </Button>
      </footer>
    </StyledStakeModalPage2>
  )
}

export default memo(StakeModalPage2)
