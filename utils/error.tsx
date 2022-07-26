import { toast } from 'react-toastify'
import { TransactionAction } from 'app/states/transaction'
import { gaEvent } from 'lib/gtag'

import { CustomToast } from 'components/Toast/CustomToast'
import { toastAnimation } from './toast'

export function handleError(error: any, transactionType?: TransactionAction) {
  //   TODO: Handle error
  console.debug(error)

  switch (error.code) {
    case 4001:
      gaEvent({
        name: 'reject_transaction',
        params: transactionType
          ? {
              type: transactionType,
            }
          : {},
      })
      break
    case 4100:
      toast(
        <CustomToast
          title="Login Required"
          description="Please log in your Metamask account."
        />,
        {
          transition: toastAnimation,
          toastId: `loginRequired-${Date.now()}`,
        }
      )
      break
    default:
      break
  }
}