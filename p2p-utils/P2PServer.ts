import { AblyClient } from './AblyClient'
import { Identity } from './Identity'

export class P2PServer {
  identity: Identity
  ably: AblyClient
  uniqueId: string
  sendMessage: (message, clientId?: string) => void

  state: {
    players: string[]
    currentTurnIndex: number
    started: boolean
  }

  constructor(identity, uniqueId, ably) {
    this.identity = identity
    this.uniqueId = uniqueId
    this.ably = ably
    this.state = { players: [], currentTurnIndex: 0, started: false }
  }

  async startGame() {
    this.state.started = true
    this.ably.sendMessage({
      kind: 'game-start',
      turn: this.state.players[0],
    })
  }

  async advanceTurn() {
    const { currentTurnIndex } = this.state
    const newTurnIndex =
      currentTurnIndex < this.state.players.length - 1
        ? currentTurnIndex + 1
        : 0
    this.state.currentTurnIndex = newTurnIndex
    this.sendMessage({
      kind: 'turn',
      turn: this.state.players[newTurnIndex],
    })
  }
  onReceiveMessage(message) {
    console.log({ message })
    switch (message.kind) {
      case 'connected':
        this.onClientConnected(message)
        break
      default:
        break
    }
  }
  onClientConnected(message) {
    console.log('connected yay')
    this.state.players.push(message.metadata)
    this.ably.sendMessage(
      { kind: 'connection-acknowledged', serverState: this.state },
      message.metadata.clientId
    )
    this.ably.sendMessage({ kind: 'peer-status', serverState: this.state })
  }
}
