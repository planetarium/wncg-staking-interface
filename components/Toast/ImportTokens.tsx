/* eslint-disable react/jsx-no-target-blank */
import { MouseEvent } from 'react'
import styles from './style.module.scss'

import { TxAction } from 'services/transaction'

import { configService } from 'services/config'
import { useImportToken } from 'hooks'
import { assertUnreachable } from 'utils/assertion'
import { getTokenSymbol } from 'utils/token'

type ImportTokensType = {
  action: TxAction
  hash: string
}

export function ImportTokens({ action, hash }: ImportTokensType) {
  const { importToken } = useImportToken()

  const tokensToImport: string[] = []

  switch (action) {
    case TxAction.ClaimAll:
      tokensToImport.push(...configService.rewardTokensList)
      break
    case TxAction.ClaimWncg:
      tokensToImport.push(configService.rewardTokensList[0])
      break
    case TxAction.ClaimBal:
      tokensToImport.push(configService.rewardTokensList[1])
      break
    default:
      assertUnreachable(action)
  }

  function handleImport(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    const { value: address } = e.currentTarget
    importToken(address)
  }

  return (
    <footer className={styles.footer}>
      {tokensToImport.map((token) => (
        <button
          key={`importTokens.${token}.${hash}`}
          type="button"
          value={token}
          onClick={handleImport}
        >
          Import <strong>{getTokenSymbol(token)}</strong> in my wallet
        </button>
      ))}
    </footer>
  )
}
