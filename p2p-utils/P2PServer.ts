import { Identity } from './Identity'
import { PubSubClient } from './PubSubClient'
export class P2PServer {
  identity: Identity
  uniqueId: string
  pubSub: PubSubClient
  state: {
    players: string[]
    currentTurnIndex: number
    started: boolean
  }

  constructor(identity, uniqueId, pubSub) {
    this.identity = identity
    this.uniqueId = uniqueId
    this.pubSub = pubSub

    this.state = { players: [], currentTurnIndex: 0, started: false }
  }

  async connect() {
    await this.pubSub.connect(this.identity, this.uniqueId)
  }

  async startGame() {
    this.state.started = true
    this.pubSub.sendMessage({
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
    this.pubSub.sendMessage({
      kind: 'turn',
      turn: this.state.players[newTurnIndex],
    })
  }
  onReceiveMessage(message) {
    switch (message.kind) {
      case 'connected':
        this.onClientConnected(message)
        break
      default:
        break
    }
  }
  onClientConnected(message) {
    this.state.players.push(message.metadata)
    this.pubSub.sendMessage(
      { kind: 'connection-acknowledged', serverState: this.state },
      message.metadata.clientId
    )
    this.pubSub.sendMessage({ kind: 'peer-status', serverState: this.state })
  }
}
