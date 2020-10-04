import { Game } from '../game/GameDefinition'

export class P2PServer {
    constructor(identity, gameId, ably) {
        this.identity = identity
        this.gameId = gameId
        this.ably = ably

        this.stateMachine = Game({
            channel: ably
        })

        this.state = {
            players: [],
            hostIdentity: this.identity,
            started: false
        }
    }

    async connect() {
        await this.ably.connect(this.identity, this.gameId)
    }

    async startGame() {
        this.state.started = true

        this.ably.sendMessage({ kind: 'game-start', serverState: this.state })
        this.stateMachine.state.players = this.state.players
        this.stateMachine.run()
    }

    async nextRound() {
        this.stateMachine.resetCurrentStepKeepingState()
        this.stateMachine.run()
    }

    onReceiveMessage(message) {
        switch (message.kind) {
            case 'connected':
                this.onClientConnected(message)
                break
            default: {
                this.stateMachine.handleInput(message)
            }
        }
    }

    onClientConnected(message) {
        this.state.players.push(message.metadata)
        this.ably.sendMessage(
            { kind: 'connection-acknowledged', serverState: this.state },
            message.metadata.clientId
        )
        this.ably.sendMessage({ kind: 'game-state', serverState: this.state })
    }
}
