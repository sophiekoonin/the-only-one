import { StandardLonghandProperties } from 'csstype'
import { Identity } from './Identity'
import { PubSubClient } from './PubSubClient'

export class P2PClient {
  identity: Identity
  uniqueId: string
  pubSub: PubSubClient
  serverState: string
  state: {
    status: string
    gameStarted: boolean
    currentTurn: string
  }

  constructor(identity, uniqueId, pubSub) {
    this.identity = identity
    this.uniqueId = uniqueId
    this.pubSub = pubSub

    this.serverState = null
    this.state = {
      status: 'disconnected',
      gameStarted: false,
      currentTurn: '',
    }
  }
  async connect() {
    await this.pubSub.connect(this.identity, this.uniqueId)

    this.pubSub.sendMessage({ kind: 'connected' })
    this.state.status = 'awaiting-acknowledgement'
  }
  onReceiveMessage(message) {
    if (message.serverState) {
      this.serverState = message.serverState
    }

    switch (message.kind) {
      case 'connected':
        this.state.status = 'acknowledged'
        break
      case 'turn':
        this.state.currentTurn = message.turn
        break
      case 'game-start':
        this.state.gameStarted = true
        this.state.currentTurn = message.turn
        break
      default:
        break
    }
  }
}
