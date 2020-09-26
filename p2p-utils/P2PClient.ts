import { Identity } from './Identity'

export class P2PClient {
  identity: Identity
  uniqueId: string
  sendMessage: (message, clientId?: string) => void
  serverState: string
  state: {
    status: string
    gameStarted: boolean
    currentTurn: string
  }

  constructor(identity, uniqueId, sendMessage) {
    this.identity = identity
    this.uniqueId = uniqueId
    this.sendMessage = sendMessage

    this.serverState = null
    this.state = {
      status: 'disconnected',
      gameStarted: false,
      currentTurn: '',
    }
  }
  async connect() {
    this.sendMessage({ kind: 'connected' })
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
