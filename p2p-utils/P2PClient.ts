import { AblyClient } from './AblyClient'
import { Identity } from './Identity'
import { ServerState } from './P2PServer'

export class P2PClient {
  identity: Identity
  ably: AblyClient
  uniqueId: string
  sendMessage: (message, clientId?: string) => void
  state: {
    status: string
    gameStarted: boolean
    currentTurn: string
  }
  onServerStateUpdate: (serverState: ServerState) => void

  constructor(identity, uniqueId, ably, onServerStateUpdate) {
    this.identity = identity
    this.uniqueId = uniqueId
    this.ably = ably

    this.onServerStateUpdate = onServerStateUpdate
    this.state = {
      status: 'disconnected',
      gameStarted: false,
      currentTurn: '',
    }
  }
  async connect() {
    this.ably.sendMessage({ kind: 'connected' })
    this.state.status = 'awaiting-acknowledgement'
  }

  onReceiveMessage(message) {
    if (message.serverState) {
      this.onServerStateUpdate(message.serverState)
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
