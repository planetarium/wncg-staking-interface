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
          <Image
            className="image"
            src="/ncg-3d.webp"
            alt="Nine chronicles gold"
            priority
          />
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
            <Button
              href="https://docs.nine-chronicles.com/introduction/intro/economic-system/staking-and-monster-collection"
              target="_blank"
              $contain
            >
              NCG Staking
            </Button>
          </li>

          <li className="linkItem">
            <Button
              href="https://medium.com/@ninechronicles/monster-collection-v2-update-6cde770c9f31"
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
              href="https://github.com/planetarium"
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
            src="/ncg-3d.webp"
            alt="Nine chronicles gold"
            priority
          />
        </div>
      </div>
    </StyledMainCard>
  )
}
