import type { MouseEvent } from 'react'
import styles from './style.module.scss'

import { getTokenSymbol } from 'utils/token'
import { useImportToken } from 'hooks'

type ImportTokensType = {
  addresses: string[]
  id: string
}

export function ImportTokens({ addresses, id }: ImportTokensType) {
  const { importToken } = useImportToken()

  function handleImport(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    const { value: address } = e.currentTarget
    importToken(address)
  }

  if (!addresses.length) return null

  return (
    <footer className={styles.footer}>
      {addresses.map((address) => (
        <button
          key={`importTokens.${id}`}
          type="button"
          value={address}
          onClick={handleImport}
        >
          Import <strong>{getTokenSymbol(address)}</strong> in my wallet
        </button>
      ))}
    </footer>
  )
}
