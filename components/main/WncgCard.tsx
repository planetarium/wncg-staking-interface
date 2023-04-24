import config from 'config'
import { useStaking } from 'hooks'

import { StyledMainCard } from './styled'
import Button from 'components/Button'
import Icon from 'components/Icon'
import Image from 'components/Image'
import TokenIcon from 'components/TokenIcon'

export default function MainWncgCard() {
  const { rewardTokenAddress } = useStaking()

  return (
    <StyledMainCard>
      <header className="header">
        <h2 className="title">
          <TokenIcon address={rewardTokenAddress} $size={24} />
          Staking Wrapped Nine Chronicles Gold
        </h2>

        <h4 className="subtitle">
          Provide WNCG liquidity.
          <br />
          You can earn WNCG and BAL reward.
        </h4>

        <dl className="rewardList">
          <div className="rewardItem">
            <dt>
              <TokenIcon address={rewardTokenAddress} $size={16} />
              <strong>Wrapped NCG</strong>
            </dt>
            <dd>1:1 NCG backed ERC-20 token</dd>
          </div>

          <div className="rewardItem">
            <dt>
              <TokenIcon address={config.bal} $size={16} />
              <strong>BAL</strong>
            </dt>
            <dd>Balancer Governance Token</dd>
          </div>
        </dl>
      </header>

      <div className="content">
        <ul className="linkList">
          <li className="linkItem">
            <Button href="/wncg" $contain>
              WNCG staking
            </Button>
          </li>

          <li className="linkItem">
            <Button
              href={config.links.medium}
              aria-label="Go to medium"
              target="_blank"
              $contain
              $variant="tertiary"
            >
              <Icon icon="medium" $size={32} />
            </Button>
          </li>

          <li className="linkItem">
            <Button
              href={config.github.repositoryUrl}
              aria-label="Go to github"
              target="_blank"
              $contain
              $variant="tertiary"
            >
              <Icon icon="github" $size={32} />
            </Button>
          </li>
        </ul>
        <div className="imageContainer">
          <Image className="image" src="/img-wncg-3d.png" alt="" priority />
        </div>
      </div>
    </StyledMainCard>
  )
}
