import '../styles/globals.css'

import { AppProps } from 'next/app'
import { P2PContextProvider } from '../lib/p2p/P2PContext'
import ConnectionDebugTools from '../components/ConnectionDebugTools'

function App({ Component, pageProps }: AppProps) {
  return (
    <P2PContextProvider>
      <Component {...pageProps} />
      <ConnectionDebugTools />
    </P2PContextProvider>
  )
}

export default App
