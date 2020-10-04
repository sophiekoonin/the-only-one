import { Game } from '../game/GameDefinition'

export class P2PClient {
    constructor(identity, gameId, ably) {
        this.identity = identity
        this.gameId = gameId
        this.ably = ably

        this.game = null
        this.serverState = null

        this.state = {
            status: 'disconnected',
            instructionHistory: [],
            lastInstruction: null
        }
    }

    async connect() {
        await this.ably.connect(this.identity, this.gameId)
        this.ably.sendMessage({ kind: 'connected' })
        this.state.status = 'awaiting-acknowledgement'
        this.depictIt = Game(this.gameId, this.ably)
    }

    onReceiveMessage(message) {
        if (message.serverState) {
            this.serverState = message.serverState
        }

        switch (message.kind) {
            case 'connection-acknowledged':
                this.state.status = 'acknowledged'
                break
            case 'instruction':
                this.state.instructionHistory.push(message)
                this.state.lastInstruction = message
                break
            default:
                break
        }
    }
}
