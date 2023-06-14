import { MouseEvent, useRef } from 'react'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import clsx from 'clsx'

import { chainIdAtom } from 'states/system'
import { isEthereum } from 'utils/isEthereum'
import {
  ANIMATION_MAP,
  EXIT_MOTION,
  TRANSITION_MAP,
} from 'config/constants/motions'
import { getNetworkLabel } from 'utils/getNetworkLabel'
import { useCloseOnBlur } from 'hooks'

import { StyledGnbChainSelectMenu } from './styled'
import CryptoIcon from 'components/CryptoIcon'

type GnbChainSelectMenuProps = {
  closeMenu(): void
  list: ChainId[]
}

export default function GnbChainSelectMenu({
  list,
  closeMenu,
}: GnbChainSelectMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const [chainId, setChainId] = useAtom(chainIdAtom)

  function onSelectChain(e: MouseEvent<HTMLButtonElement>) {
    const { value } = e.currentTarget
    const newPathname = `/wncg/${value}`

    if (newPathname !== router.pathname) {
      router.replace(router.pathname, `/wncg/${value}`, { shallow: true })
      setChainId(Number(value) as ChainId)
    }

    closeMenu()
  }

  useCloseOnBlur(menuRef, closeMenu)

  return (
    <StyledGnbChainSelectMenu
      ref={menuRef}
      {...EXIT_MOTION}
      variants={ANIMATION_MAP.slideInDown}
      transition={TRANSITION_MAP.dropdown}
    >
      <ul>
        {list.map((item) => {
          return (
            <li
              className={clsx({ selected: item === chainId })}
              key={`gnbChainSelectMenu:${item}`}
            >
              <button
                className="chainButton"
                value={item}
                onClick={onSelectChain}
              >
                <CryptoIcon
                  icon={isEthereum(item) ? 'ether' : 'bnb'}
                  $size={24}
                />
                {getNetworkLabel(item)}
              </button>
            </li>
          )
        })}
      </ul>
    </StyledGnbChainSelectMenu>
  )
}
