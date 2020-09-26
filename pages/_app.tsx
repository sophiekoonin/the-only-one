import '../styles/globals.css'

import { AppProps } from 'next/app'
import { P2PContextProvider } from '../p2p-utils/P2PContext'

function App({ Component, pageProps }: AppProps) {
  return (
    <P2PContextProvider>
      <Component {...pageProps} />
    </P2PContextProvider>
  )
}

export default App
