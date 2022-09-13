/* eslint-disable react/jsx-no-target-blank */
import { MouseEvent } from 'react'
import styles from './style.module.scss'

import { useImportToken } from 'hooks'
import { getTokenSymbol } from 'utils/token'

type ImportTokensType = {
  addresses: string[]
  hash: string
}

export function ImportTokens({ addresses, hash }: ImportTokensType) {
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
          key={`importTokens.${address}.${hash}`}
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
