export class P2PClient {
    constructor(identity, uniqueId, ably) {
        this.identity = identity
        this.uniqueId = uniqueId
        this.ably = ably

        this.serverState = null
        this.state = {
            status: 'disconnected',
            receivedWords: '',
            gameStarted: false,
            currentTurn: '',
            lastMessage: ''
        }
    }
    async connect() {
        await this.ably.connect(this.identity, this.uniqueId)

        this.ably.sendMessage({ kind: 'connected' })
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
            case 'word':
                this.state.receivedWords += ' ' + message.word
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
