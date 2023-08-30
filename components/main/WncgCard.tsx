import config from 'config'
import { SUPPORTED_CHAINS, defaultChainId } from 'config/chains'
import { BAL_ADDRESS, WNCG_ADDRESS } from 'config/constants/addresses'
import { chainNameFor } from 'utils/chainNameFor'
import { isEthereum } from 'utils/isEthereum'

import { StyledMainCard } from './styled'
import Button from 'components/Button'
import CryptoIcon from 'components/CryptoIcon'
import Icon from 'components/Icon'
import Image from 'components/Image'
import TokenIcon from 'components/TokenIcon'

export default function MainWncgCard() {
  return (
    <StyledMainCard>
      <header className="header">
        <h2 className="title">
          <TokenIcon
            className="logoIcon"
            address={WNCG_ADDRESS[defaultChainId]}
            $size={24}
          />
          Staking Wrapped Nine Chronicles Gold
        </h2>

        <div className="linkGroup">
          {SUPPORTED_CHAINS.map((c) => {
            return (
              <span className="chainButton" key={`wncgCard:links:${c}`}>
                <CryptoIcon icon={isEthereum(c) ? 'ether' : 'bnb'} $size={24} />
                {chainNameFor(c)}
              </span>
            )
          })}
        </div>

        <div className="mobileImage">
          <Image
            className="image"
            src="/wncg-3d.webp"
            alt="Wrapped ine chronicles gold"
            priority
          />
        </div>

        <h4 className="subtitle">
          Provide WNCG liquidity.
          <br />
          You can earn WNCG and BAL reward.
        </h4>

        <div className="group">
          <p className="desc afterLaptop">
            WNCG Staking is available on Ethereum and BNB Smart Chain. *BAL
            reward is only on Ethereum.
          </p>

          <dl className="rewardList">
            <div className="rewardItem">
              <dt>
                <TokenIcon address={WNCG_ADDRESS[defaultChainId]} $size={16} />
                <strong>WNCG(Wrapped NCG)</strong>
              </dt>
              <dd>1:1 NCG backed ERC-20 token</dd>
            </div>

            <div className="rewardItem">
              <dt>
                <TokenIcon
                  address={BAL_ADDRESS[defaultChainId] as Hash}
                  $size={16}
                />
                <strong>BAL</strong>
              </dt>
              <dd>Balancer Governance Token</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="content">
        <ul className="linkList">
          <li className="linkItem">
            <Button href="/wncg" target="_blank" $contain>
              WNCG Staking
            </Button>
          </li>
          <li className="linkItem">
            <Button
              href={config.stakingLinks.medium}
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
              href={config.stakingLinks.github}
              aria-label="Go to github"
              target="_blank"
              $contain
              $variant="tertiary"
            >
              <Icon icon="github" $size={32} />
            </Button>
          </li>
        </ul>

        <div className="tabletImage">
          <Image
            className="image"
            src="/wncg-3d.webp"
            alt="Wrapped ine chronicles gold"
            priority
          />
        </div>
      </div>
    </StyledMainCard>
  )
}
