import { toast } from 'react-toastify'
import { nanoid } from 'nanoid'

import { TxAction } from 'services/transaction'
import { gaEvent } from 'lib/gtag'
import { toastAnimation } from './toast'

import { CustomToast } from 'components/Toast/CustomToast'

export function handleError(error: any, transactionType?: TxAction) {
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
          message="Please log in your Metamask account."
        />,
        {
          transition: toastAnimation,
          toastId: `loginRequired-${nanoid()}`,
        }
      )
      break
    default:
      break
  }
}
