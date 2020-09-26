import React from 'react'
import * as Ably from 'ably'
import { Identity } from './Identity'
import { P2PClient } from './P2PClient'
import { P2PServer } from './P2PServer'

function shouldHandleMessage(message, metadata) {
  return (
    message.forClientId == null ||
    !message.forClientId ||
    (message.forClientId && message.forClientId === metadata.clientId)
  )
}

export function handleMessageFromAbly(message, metadata, p2pClient, p2pServer) {
  if (shouldHandleMessage(message, metadata)) {
    p2pServer?.onReceiveMessage(message)
    p2pClient?.onReceiveMessage(message)
  }
}

const defaultContext = {
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
  const [p2pClient, setP2pClient] = React.useState(null)
  const [p2pServer, setP2pServer] = React.useState(null)
  const [playerName, setPlayerName] = React.useState(null)
  const [connected, setConnected] = React.useState(false)
  const [channel, setChannel] = React.useState(null)
  const [metadata, setMetadata] = React.useState(null)

  async function connect(identity, uniqueId) {
    if (connected) return

    setMetadata({ uniqueId: uniqueId, ...identity })

    const ably = new Ably.Realtime.Promise({
      authUrl: '/api/createToken',
    })
    // @ts-ignore types are too strict
    const ch = await ably.channels.get(`only-one-${uniqueId}`)
    ch.subscribe((message) => {
      handleMessageFromAbly(message.data, metadata, p2pClient, p2pServer)
    })

    setChannel(ch)
    setConnected(true)
  }

  function sendMessage(message, targetClientId?: string) {
    // if (!connected) {
    //   throw 'Client is not connected'
    // }

    message.metadata = metadata
    message.forClientId = targetClientId ? targetClientId : null
    channel.publish({ name: 'only-one-message', data: message })
  }

  async function host(gameId: string, playerName: string) {
    setPlayerName(playerName)
    const identity = new Identity(playerName)
    const server = new P2PServer(identity, gameId, sendMessage)
    const client = new P2PClient(identity, gameId, sendMessage)
    setP2pServer(server)
    setP2pClient(client)
    await connect(identity, gameId)

    client.connect()
  }

  async function join(gameId: string, playerName: string) {
    setPlayerName(playerName)
    const identity = new Identity(playerName)
    const client = new P2PClient(identity, gameId, sendMessage)
    setP2pClient(client)
    await connect(identity, gameId)
    client.connect()
  }

  return (
    <P2PContext.Provider
      value={{
        p2pClient,
        p2pServer,
        playerName,
        host,
        join,
      }}
    >
      {children}
    </P2PContext.Provider>
  )
}
