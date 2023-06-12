// FIXME: 버튼 라벨, 심볼, name 통일
import { MouseEvent, useMemo, useRef } from 'react'

import { ConnectorId } from 'config/constants'
import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import {
  useAuth,
  useCloseOnBlur,
  useImportToken,
  useResponsive,
  useStaking,
} from 'hooks'

import { StyledGlobalFooterImportTokenDropdownMenu } from './styled'
import ConnectorIcon from 'components/ConnectorIcon'
import Icon from 'components/Icon'
import TokenIcon from 'components/TokenIcon'

type GlobalFooterImportTokenDropdownProps = {
  closeDropdown(): void
}

export default function GlobalFooterImportTokenDropdownMenu({
  closeDropdown,
}: GlobalFooterImportTokenDropdownProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  const { connector } = useAuth()
  const { importToken: _importToken } = useImportToken()
  const { isHandheld } = useResponsive()
  const { lpToken, rewardTokenAddresses, tokens } = useStaking()

  useCloseOnBlur(menuRef, closeDropdown)

  const list = useMemo(
    () => [...rewardTokenAddresses, lpToken.address],
    [lpToken.address, rewardTokenAddresses]
  )

  function onImportToken(e: MouseEvent<HTMLButtonElement>) {
    const { value: addr } = e.currentTarget
    const tokenInfo = tokens[addr as Hash] ?? {}

    _importToken({
      ...tokenInfo,
      name: addr === lpToken.address ? tokenInfo.name : tokenInfo.symbol,
    })
    closeDropdown()
  }

  if (!connector) return null
  if (connector?.id === ConnectorId.Binance) return null

  return (
    <StyledGlobalFooterImportTokenDropdownMenu
      {...EXIT_MOTION}
      ref={menuRef}
      className="tokenMenu"
      variants={ANIMATION_MAP.slideInUp}
    >
      <header className="dropdownHeader">
        <h4 className="title">Import token</h4>
        <button className="closeButton" type="button" onClick={closeDropdown}>
          <Icon icon="close" $size={24} />
        </button>
      </header>

      {list.map((addr) => {
        const { symbol } = tokens[addr]

        return (
          <button
            key={`globalFooter:importTokenDropdown:${addr}`}
            className="tokenButton"
            type="button"
            value={addr}
            onClick={onImportToken}
          >
            {symbol}

            <TokenIcon className="token" address={addr} $size={16} $dark />

            {isHandheld && (
              <ConnectorIcon
                className="rightIcon"
                icon={connector.id as ConnectorIconType}
              />
            )}
          </button>
        )
      })}
    </StyledGlobalFooterImportTokenDropdownMenu>
  )
}
