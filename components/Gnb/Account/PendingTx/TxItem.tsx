// /* eslint-disable react/jsx-no-target-blank */
// import { MouseEvent, useState } from 'react'
// import { useMount } from 'react-use'
// import { motion } from 'framer-motion'
// import styles from './style.module.scss'

// // import { Transaction } from 'app/states/transaction'
// import { renderTxTitle } from 'utils/transaction'
// import { getTxUrl } from 'utils/url'
// // import { useAppDispatch, useTransaction } from 'hooks'
// import { listItemVariants } from '../constants'

// import { Icon } from 'components/Icon'

type TxItemProps = {
  transaction: any
}

export function TxItem({ transaction }: TxItemProps) {
  // const [isCanceled, setIsCanceled] = useState(false)
  // const [isFailed, setIsFailed] = useState(false)
  // const { hash, summary, action } = transaction

  // async function checkTxStatus() {
  //   // try {
  //   // const receipt = await getTransactionReceipt(hash)
  //   // if (receipt?.status === 1) {
  //   // NOTE: Fulfilled tx
  //   // dispatch(removeTx(hash))
  //   // } else {
  //   // NOTE: Canceled tx
  //   // setIsCanceled(true)
  //   // setConfirmations(hash)
  //   // }
  //   // } catch (error) {
  //   // NOTE: Failed tx
  //   // setIsFailed(true)
  //   // setConfirmations(hash)
  //   // }
  // }

  // function handleDelete(e: MouseEvent<HTMLButtonElement>) {
  //   e.stopPropagation()
  //   // dispatch(removeTx(hash))
  // }

  // useMount(() => {
  //   checkTxStatus()
  // })

  // return (
  //   <motion.li
  //     className={styles.txItem}
  //     key={`txItem.${hash}`}
  //     initial="initial"
  //     animate="animate"
  //     exit="exit"
  //     variants={listItemVariants}
  //   >
  //     <header>
  //       <h4>
  //         <a href={getTxUrl(hash)} target="_blank" rel="noopener">
  //           {isFailed && (
  //             <>
  //               <span className={styles.emoji}>💥</span>
  //               <span>Failed:</span>
  //             </>
  //           )}
  //           {isCanceled && (
  //             <>
  //               <span className={styles.emoji}>❌</span>
  //               <span>Canceled:</span>
  //             </>
  //           )}
  //           {renderTxTitle(action)}
  //         </a>
  //       </h4>
  //       <a
  //         className={styles.link}
  //         href={getTxUrl(hash)}
  //         target="_blank"
  //         rel="noopener"
  //       >
  //         <Icon id="externalLink" />
  //       </a>
  //     </header>

  //     <p>{summary}</p>

  //     <button
  //       className={styles.deleteButton}
  //       type="button"
  //       onClick={handleDelete}
  //     >
  //       <Icon id="bin" ariaLabel="Delete this item" />
  //     </button>
  //   </motion.li>
  // )
  return null
}
