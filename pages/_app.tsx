import { PropsWithChildren, useRef } from 'react'
import ReactGA from 'react-ga4'
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { DehydratedState } from '@tanstack/react-query'
import { useMount } from 'react-use'
import { Provider } from 'jotai'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import Script from 'next/script'
import { DefaultSeo } from 'next-seo'
import { WagmiConfig } from 'wagmi'
import { queryClientAtom } from 'jotai-tanstack-query'
import { useHydrateAtoms } from 'jotai/utils'
import 'react-toastify/dist/ReactToastify.css'

import config from 'config'
import { DEFAULT_SEO } from 'lib/seo'
import wagmiClient from 'lib/wagmi/client'

import Effects from 'components/GlobalHooks'
import Layout from 'components/Layout'
import ToastContainer from 'components/ToastContainer'

import GlobalStyle from 'styles/GlobalStyle'
import ToastStyle from 'styles/ToastStyle'

type MyAppProps = AppProps & {
  pageProps: {
    dehydratedState: DehydratedState
  }
}

type HydrateAtomsProps = {
  queryClient: QueryClient
} & PropsWithChildren

function HydrateAtoms({ queryClient, children }: HydrateAtomsProps) {
  useHydrateAtoms([[queryClientAtom, queryClient]])
  return <>{children}</>
}

function MyApp({ Component, pageProps }: MyAppProps) {
  const queryClient = useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          cacheTime: Infinity,
          suspense: true,
          keepPreviousData: true,
          refetchOnReconnect: true,
          useErrorBoundary(error: any) {
            return error.reason !== 'INVALID_ARGUMENT'
          },
        },
      },
    })
  )
  const isProd = config.env === 'production'

  useMount(() => {
    if (!isProd) return
    ReactGA.initialize(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string)
  })

  return (
    <>
      {isProd && (
        <Script
          id="hotjar"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_SITE_ID},hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
          }}
        />
      )}

      <QueryClientProvider client={queryClient.current}>
        <Hydrate state={pageProps.dehydratedState}>
          <Provider>
            <HydrateAtoms queryClient={queryClient.current}>
              <WagmiConfig client={wagmiClient}>
                <GlobalStyle />
                <ToastStyle />

                <DefaultSeo {...DEFAULT_SEO} />

                <Layout>
                  <Component {...pageProps} />
                </Layout>

                <ToastContainer />
                <Effects />
                <ReactQueryDevtools />
              </WagmiConfig>
            </HydrateAtoms>
          </Provider>
        </Hydrate>
      </QueryClientProvider>
    </>
  )
}

export default MyApp

export function reportWebVitals({ id, name, value }: NextWebVitalsMetric) {
  if (name === 'Next.js-hydration') return

  window?.gtag?.('event', name, {
    event_category: 'Web Vitals',
    value: Math.round(name === 'CLS' ? value * 1_000 : value),
    event_label: id, // id unique to current page load
    non_interaction: true, // avoids affecting bounce rate.
  })
}
