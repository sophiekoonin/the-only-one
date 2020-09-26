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
  host: (gameId: string, playerName: string) => {},
  join: (gameId: string, playerName: string) => {},
}
type Props = {
  children: React.ReactNode
}

export const P2PContext = React.createContext(defaultContext)

export class P2PContextProvider extends React.Component<Props, {}> {
  pubSub: PubSubClient
  p2pClient: P2PClient
  p2pServer?: P2PServer

  constructor(props: Props) {
    super(props)
    this.pubSub = null
    this.p2pClient = null
    this.p2pServer = null
  }

  initPubSub = () => {
    if (this.pubSub != null) {
      return isNull
    }
    this.pubSub = new PubSubClient((message, metadata) => {
      handleMessageFromAbly(message, metadata, this.p2pClient, this.p2pServer)
    })
  }

  host = async (gameId: string, playerName: string) => {
    this.initPubSub()
    const identity = new Identity(playerName)
    this.p2pServer = new P2PServer(identity, gameId, this.pubSub)
    this.p2pClient = new P2PClient(identity, gameId, this.pubSub)

    await this.p2pServer.connect()
    await this.p2pClient.connect()
  }

  join = async (gameId: string, playerName: string) => {
    this.initPubSub()
    const identity = new Identity(playerName)
    this.p2pClient = new P2PClient(identity, gameId, this.pubSub)
    await this.p2pClient.connect()
  }

  render() {
    return (
      <P2PContext.Provider
        value={{
          pubSub: this.pubSub,
          p2pClient: this.p2pClient,
          p2pServer: this.p2pServer,
          host: this.host,
          join: this.join,
        }}
      >
        {this.props.children}
      </P2PContext.Provider>
    )
  }
}
