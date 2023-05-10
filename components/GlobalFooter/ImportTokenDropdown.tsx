import { MouseEvent, useState } from 'react'
import { AnimatePresence } from 'framer-motion'

import { useAuth, useImportToken } from 'hooks'

import { StyledGlobalFooterImportTokenDropdown } from './styled'
import ConnectorIcon from 'components/ConnectorIcon'
import DropdownMenu from './ImportTokenDropdownMenu'

type GlobalFooterImportTokenDropdownProps = {
  className?: string
}

export default function GlobalFooterImportTokenDropdown({
  className,
}: GlobalFooterImportTokenDropdownProps) {
  const [show, setShow] = useState(false)

  const { connector } = useAuth()
  const { canImportToken, importToken: _importToken } = useImportToken()

  function toggle(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    setShow((prev) => !prev)
  }

  function closeDropdown() {
    setShow(false)
  }

  if (!canImportToken) return null

  return (
    <StyledGlobalFooterImportTokenDropdown className={className}>
      <button className="tokenToggle" type="button" onClick={toggle}>
        Import token
        <ConnectorIcon icon={connector?.id as ConnectorIconType} $size={16} />
      </button>

      <AnimatePresence>
        {show && <DropdownMenu closeDropdown={closeDropdown} />}
      </AnimatePresence>
    </StyledGlobalFooterImportTokenDropdown>
  )
}
