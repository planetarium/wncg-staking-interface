import { useProvider } from './useProvider'

export function useTransaction() {
  const provider = useProvider()

  async function getTransactionDetail(hash: string) {
    const txInfo = await provider?.getTransaction(hash)
    return txInfo
  }

  async function getTransactionReceipt(hash: string) {
    const txInfo = await getTransactionDetail(hash)
    const receipt = await txInfo?.wait()
    return receipt
  }

  return {
    getTransactionDetail,
    getTransactionReceipt,
  }
}
