import { Game } from '../game/GameDefinition'

export class P2PServer {
    constructor(identity, uniqueId, ably) {
        this.identity = identity
        this.uniqueId = uniqueId
        this.ably = ably
        this.stateMachine = Game({
            channel: ably
        })
        this.state = {
            players: [],
            currentTurnIndex: 0,
            hostIdentity: this.identity,
            started: false
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
        this.stateMachine.state.players = this.state.players
        this.stateMachine.run()
    }

    async nextRound() {
        this.stateMachine.startNewRound()
        this.stateMachine.run()
    }

    // async advanceTurn() {
    //     const { currentTurnIndex } = this.state
    //     const newTurnIndex =
    //         currentTurnIndex < this.state.players.length - 1
    //             ? currentTurnIndex + 1
    //             : 0
    //     this.state.currentTurnIndex = newTurnIndex
    //     this.ably.sendMessage({
    //         kind: 'turn',
    //         turn: this.state.players[newTurnIndex]
    //     })
    // }
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
