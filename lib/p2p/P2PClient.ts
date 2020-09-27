import { AblyClient } from './AblyClient'
import { Identity } from './Identity'
import { ServerState } from './P2PServer'

export class P2PClient {
  identity: Identity
  ably: AblyClient
  uniqueId: string
  state: {
    status: string
    gameStarted: boolean
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
    }
  }
  async connect() {
    this.ably.sendMessage({ kind: 'connected' })
    this.state.status = 'awaiting-acknowledgement'
  }

  onSubmitWord(word: string) {
    this.ably.sendMessage({ kind: 'word', word })
  }
  onReceiveMessage(message) {
    if (message.serverState) {
      this.onServerStateUpdate(message.serverState)
    }

    switch (message.kind) {
      case 'connected':
        this.state.status = 'acknowledged'
        break
      case 'game-start':
        this.state.gameStarted = true
        break
      default:
        break
    }
  }
}
