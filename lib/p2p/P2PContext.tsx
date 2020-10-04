import React from 'react'
import Ably from 'ably'

import { Identity } from './Identity'
import { P2PClient } from './P2PClient'
import { P2PServer, ServerState } from './P2PServer'
import { AblyClient } from './AblyClient'

const defaultContext = {
  p2pClient: null,
  p2pServer: null,
  playerName: null,
  clientId: null,
  players: null,
  connectionState: null,
  disconnect: () => {},
  host: (gameId: string, playerName: string) => {},
  join: (gameId: string, playerName: string) => {},
}
type Props = {
  children: React.ReactNode
}

export const P2PContext = React.createContext(defaultContext)

export class P2PContextProvider extends React.Component {
  state = {
    connectionState: null,
    connected: false,
    playerName: null,
    clientId: null,
    p2pServer: null,
    p2pClient: null,
    ably: null,
    words: null,
    players: null,
    started: false,
    currentTurnIndex: 0,
    currentStage: null,
  }

  constructor(props: Props) {
    super(props)
  }

  onServerStateUpdate(serverState: ServerState) {
    this.setState({ ...serverState })
  }
  async connect(identity, uniqueId) {
    debugger
    if (this.state.connected === true) return
    const ably = new AblyClient(
      identity,
      uniqueId,
      (stateChange: Ably.Types.ConnectionStateChange) => {
        this.setState({ connectionState: stateChange.current })
      }
    )
    await this.setState({ ably })
    await this.state.ably.connect((message: Ably.Types.Message) => {
      this.state.p2pServer?.onReceiveMessage(message)
      this.state.p2pClient?.onReceiveMessage(message)
    })
  }

  disconnect() {
    this.state.ably.disconnect()
  }

  async host(gameId: string, playerName: string) {
    const identity = new Identity(playerName)
    await this.connect(identity, gameId)
    const server = new P2PServer(identity, gameId, this.state.ably)
    const client = new P2PClient(
      identity,
      gameId,
      this.state.ably,
      this.onServerStateUpdate.bind(this)
    )
    await this.setState({
      p2pServer: server,
      p2pClient: client,
      playerName,
      clientId: identity.clientId,
    })
    debugger

    await client.connect()
  }

  async join(gameId: string, playerName: string) {
    const identity = new Identity(playerName)
    await this.connect(identity, gameId)
    const client = new P2PClient(
      identity,
      gameId,
      this.state.ably,
      this.onServerStateUpdate.bind(this)
    )
    await this.setState({
      p2pClient: client,
      playerName,
    })
    await client.connect()
  }

  render() {
    const {
      p2pClient,
      p2pServer,
      playerName,
      players,
      clientId,
      connectionState,
    } = this.state

    return (
      <P2PContext.Provider
        value={{
          p2pClient,
          p2pServer,
          playerName,
          clientId,
          players,
          connectionState,
          disconnect: this.disconnect.bind(this),
          host: this.host.bind(this),
          join: this.join.bind(this),
        }}
      >
        {this.props.children}
      </P2PContext.Provider>
    )
  }
}
