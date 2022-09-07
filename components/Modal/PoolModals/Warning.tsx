import styles from './style.module.scss'

import { Icon } from 'components/Icon'

type PreviewWarningProps = {
  error?: any
  rektPriceImpact?: boolean
}

export function PreviewWarning({
  error,
  rektPriceImpact,
}: PreviewWarningProps) {
  if (rektPriceImpact) {
    return (
      <aside className={styles.warning}>
        <h3>
          <Icon id="info" />
          This price impact is too high.
          <br />
          You cannot proceed.
        </h3>
        <p>
          The likelyhood of you losing money is too high. For your protection,
          you can&apos;t perform this transaction on this interface.
        </p>
      </aside>
    )
  }

  const errorText = parseError(error)

  if (error) {
    return (
      <div>
        <aside className={styles.warning}>
          <h3>
            <Icon id="info" />
            {errorText.title}
          </h3>
          {errorText.message && <p>{errorText.message}</p>}
        </aside>
      </div>
    )
  }

  return null
}

function parseError(error: any) {
  switch (true) {
    case /transfer amount exceeds/.test(error?.reason):
      return {
        title: 'Insufficient balance',
        message:
          "You don't have enough balance in your account for the transaction.",
      }
    case /BAL#207/.test(error?.reason):
    case /BAL#406/.test(error?.reason):
      return {
        title: 'Cannot estimate gas',
        message: 'Transaction may fail or require manual gas limit.',
      }
    default:
      return {
        title: 'Something went wrong',
        message: 'Sorry for the inconvenience. Please try again later.',
      }
  }
}
