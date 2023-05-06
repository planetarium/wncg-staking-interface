import config from 'config'

import { StyledMainCard } from './styled'
import Button from 'components/Button'
import CryptoIcon from 'components/CryptoIcon'
import Icon from 'components/Icon'
import Image from 'components/Image'

export default function MainNcgCard() {
  return (
    <StyledMainCard>
      <header className="header">
        <h2 className="title">
          <CryptoIcon className="logoIcon" icon="ncg" $size={24} />
          Staking Nine Chronicles Gold
        </h2>

        <div className="mobileImage">
          <Image className="image" src="/img-ncg-3d.png" alt="" priority />
        </div>

        <h4 className="subtitle">
          Deposit NCGs and earn core items
          <br />
          in Nine Chronicles.
        </h4>
      </header>

      <div className="content">
        <ul className="linkList">
          <li className="linkItem">
            <Button href="/wncg" target="_blank" $contain>
              NCG staking
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

        <div className="tabletImage">
          <Image className="image" src="/img-ncg-3d.png" alt="" priority />
        </div>
      </div>
    </StyledMainCard>
  )
}
