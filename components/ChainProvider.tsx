import { ChainId } from 'config/chains'
import { SetStateAction } from 'jotai'
import { AppProps } from 'next/app'
import {
  Dispatch,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react'
import Code from './Code'

const ChainContext = createContext<{
  chainId: ChainId | null
  setChainId: Dispatch<ChainId> | null
}>({
  chainId: null,
  setChainId: null,
})

type ChainContextProvider = {
  pageProps: AppProps['pageProps']
} & PropsWithChildren

// Custom wrapper component
export function ChainContextProvider({
  pageProps,
  children,
}: ChainContextProvider) {
  const [chainId, setChainId] = useState(pageProps.chainId ?? ChainId.ETHEREUM)

  return (
    <ChainContext.Provider value={{ chainId, setChainId }}>
      {children}
    </ChainContext.Provider>
  )
}

// Helper hook to access the context value
function useChainContext() {
  return useContext(ChainContext)
}

export { useChainContext, ChainContext }
