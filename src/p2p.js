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
            currentTurn: ''
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

export class P2PServer {
    constructor(identity, uniqueId, ably) {
        this.identity = identity
        this.uniqueId = uniqueId
        this.ably = ably

        this.state = { players: [], currentTurnIndex: 0, started: false }
    }
    async sendWordsAcrossMultipleMessages() {
        const phrase = "Long before his nine o'clock headache appears".split(
            ' '
        )
        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

        for (let word of phrase) {
            this.ably.sendMessage({
                kind: 'word',
                word: word,
                serverState: this.state
            })
            await sleep(500)
        }
    }
    async connect() {
        await this.ably.connect(this.identity, this.uniqueId)
    }

    async startGame() {
        this.state.started = true
        this.ably.sendMessage({
            kind: 'game-start',
            turn: this.state.players[0]
        })
    }

    async advanceTurn() {
        const { currentTurnIndex } = this.state
        const newTurnIndex =
            currentTurnIndex < this.state.players.length - 1
                ? currentTurnIndex + 1
                : 0
        this.state.currentTurnIndex = newTurnIndex
        this.ably.sendMessage({
            kind: 'turn',
            turn: this.state.players[newTurnIndex]
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
        this.ably.sendMessage(
            { kind: 'connection-acknowledged', serverState: this.state },
            message.metadata.clientId
        )
        this.ably.sendMessage({ kind: 'peer-status', serverState: this.state })
    }
}
