import { useRef } from 'react'
import ReactGA from 'react-ga4'
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useMount } from 'react-use'
import { Provider } from 'jotai'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import { DefaultSeo } from 'next-seo'
import { ThemeProvider } from 'styled-components'
import { WagmiConfig } from 'wagmi'
import 'react-toastify/dist/ReactToastify.css'
import 'styles/globals.scss'
import 'styles/toast.scss'

import { configService } from 'services/config'
import { DEFAULT_SEO } from 'lib/seo'
import wagmiClient from 'lib/wagmi'

import Gnb from 'new/Gnb'
import GlobalFooter from 'new/GlobalFooter'
import { CoingeckoAlert } from 'components/CoingeckoAlert'
import { NetworkAlert } from 'components/NetworkAlert'
import { ToastContainer } from 'components/ToastContainer'
import MediaQueryEffects from 'components/Effects/MediaQueryEffects'
import { ToastEffects } from 'components/Effects/ToastEffects'

const Modal = dynamic(() => import('components/Modal'))

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = useRef(new QueryClient())
  const config = configService.env.env
  const isProd = config === 'production'

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

      <ThemeProvider theme={{}}>
        <QueryClientProvider client={queryClient.current}>
          <Hydrate state={pageProps.dehydratedState}>
            <Provider>
              <WagmiConfig client={wagmiClient}>
                <DefaultSeo {...DEFAULT_SEO} />
                <CoingeckoAlert />
                <NetworkAlert />
                <Gnb />
                <Component {...pageProps} />
                <ToastEffects />
                <Modal />
                <ToastContainer />
                <GlobalFooter />
                <MediaQueryEffects />
              </WagmiConfig>
            </Provider>
          </Hydrate>
        </QueryClientProvider>
      </ThemeProvider>
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
