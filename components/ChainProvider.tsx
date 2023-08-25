import { ChainId, defaultChainId } from 'config/chains'
import { AppProps } from 'next/app'
import {
  Dispatch,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react'

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
  const [chainId, setChainId] = useState(pageProps.chainId ?? defaultChainId)

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
