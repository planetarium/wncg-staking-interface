import { ModalType } from 'config/constants'
import { useFiat, useModal, useStaking } from 'hooks'
import { useFetchUserRewards } from 'hooks/queries'

import { StyledWalletSingleRewards } from './styled'
import Button from 'components/Button'
import CountUp from 'components/CountUp'
import NumberFormat from 'components/NumberFormat'

type WalletSingleRewardsProps = {
  closeWallet(): void
}

export default function WalletSingleRewards({
  closeWallet,
}: WalletSingleRewardsProps) {
  const toFiat = useFiat()
  const { addModal } = useModal()
  const { rewardTokenAddresses, tokens } = useStaking()
  const rewardToken = tokens?.[rewardTokenAddresses[0]]

  const { earnedTokenRewards = [], hasRewards } =
    useFetchUserRewards().data ?? {}

  function onClickClaimRewards() {
    addModal({
      type: ModalType.Claim,
    })
    closeWallet()
  }

  const rewardsAmount = earnedTokenRewards[0] ?? '0'
  const rewardsFiatValue = toFiat(rewardsAmount, rewardToken?.address)

  return (
    <StyledWalletSingleRewards>
      <div
        className="rewardItem"
        key={`gnb:myStaking:walletStaking:${rewardToken?.address}`}
      >
        <dt className="a11y">{rewardToken?.symbol}</dt>
        <dd>
          <CountUp value={rewardsAmount} plus symbol={rewardToken.symbol} />
          {hasRewards && (
            <span className="parenthesis">
              <NumberFormat value={rewardsFiatValue} type="fiat" abbr />
            </span>
          )}
        </dd>
      </div>

      {hasRewards && (
        <div className="rewardItem">
          <dt className="a11y">Actions</dt>
          <dd>
            <Button
              className="claimButton"
              onClick={onClickClaimRewards}
              $size="sm"
              $variant="tertiary"
            >
              Claim rewards
            </Button>
          </dd>
        </div>
      )}
    </StyledWalletSingleRewards>
  )
}
