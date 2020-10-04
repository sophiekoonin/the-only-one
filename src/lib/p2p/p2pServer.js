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
            currentTurnIndex: -1,
            turnPlayer: null,
            hostIdentity: this.identity,
            started: false
        }
    }

    async connect() {
        await this.ably.connect(this.identity, this.gameId)
    }

    async startGame() {
        this.state.started = true
        this.stateMachine.state.players = this.state.players
        this.assignTurnPlayer()
        this.ably.sendMessage({ kind: 'game-start', serverState: this.state })
        this.stateMachine.run()
    }

    assignTurnPlayer() {
        this.state.currentTurnIndex = this.state.currentTurnIndex + 1
        this.state.turnPlayer = this.state.players[this.state.currentTurnIndex]

        this.stateMachine.state.currentTurnIndex = this.state.currentTurnIndex
        this.stateMachine.state.turnPlayer = this.state.turnPlayer
    }

    async nextRound() {
        this.stateMachine.resetCurrentStepKeepingState()
        this.assignTurnPlayer()
        this.ably.sendMessage({ kind: 'new-round', serverState: this.state })
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
