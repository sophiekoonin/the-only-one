import React from 'react'

const defaultContext = {
  p2pClient: null,
  p2pServer: null,
}
export const P2PContext = React.createContext(defaultContext)

type Props = { children }
export function P2PContextProvider({ children }: Props) {
  const [p2pClient, setP2pClient] = React.useState(null)
  const [p2pServer, setP2pServer] = React.useState(null)
  const [playerName, setPlayerName] = React.useState('')
  const [sessId, setSessId] = React.useState('')

  return (
    <P2PContext.Provider value={defaultContext}>{children}</P2PContext.Provider>
  )
}
