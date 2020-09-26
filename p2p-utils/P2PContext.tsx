import React from 'react'
import { isNull } from 'util'
import { Identity } from './Identity'
import { P2PClient } from './P2PClient'
import { P2PServer } from './P2PServer'
import { handleMessageFromAbly, PubSubClient } from './PubSubClient'

const defaultContext = {
  pubSub: null,
  p2pClient: null,
  p2pServer: null,
  playerName: null,
  host: (gameId: string, playerName: string) => {},
  join: (gameId: string, playerName: string) => {},
}
type Props = {
  children: React.ReactNode
}

export const P2PContext = React.createContext(defaultContext)

export function P2PContextProvider({ children }: Props) {
  const [pubSub, setPubSub] = React.useState(null)
  const [p2pClient, setP2pClient] = React.useState(null)
  const [p2pServer, setP2pServer] = React.useState(null)
  const [playerName, setPlayerName] = React.useState(null)

  function initPubSub() {
    if (pubSub != null) {
      return pubSub
    }
    const ps = new PubSubClient((message, metadata) => {
      handleMessageFromAbly(message, metadata, p2pClient, p2pServer)
    })
    setPubSub(ps)
    return ps
  }

  async function host(gameId: string, playerName: string) {
    const ps = initPubSub()
    setPlayerName(playerName)
    const identity = new Identity(playerName)
    const server = new P2PServer(identity, gameId, ps)
    const client = new P2PClient(identity, gameId, ps)
    setP2pServer(server)
    setP2pClient(client)

    await server.connect()
    await client.connect()
  }

  async function join(gameId: string, playerName: string) {
    const ps = initPubSub()
    setPlayerName(playerName)
    const identity = new Identity(playerName)
    const client = new P2PClient(identity, gameId, ps)
    setP2pClient(client)
    await client.connect()
  }

  return (
    <P2PContext.Provider
      value={{
        pubSub: pubSub,
        p2pClient: p2pClient,
        p2pServer: p2pServer,
        playerName: playerName,
        host: host,
        join: join,
      }}
    >
      {children}
    </P2PContext.Provider>
  )
}
