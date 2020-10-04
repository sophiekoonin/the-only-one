export class NewRoundHandler {
    async execute(state) {
        state.activePlayers = state.players.slice()
        state.currentTurnIndex = state.currentTurnIndex++

        state.turnPlayer = state.activePlayers[state.currentTurnIndex]
        state.nonTurnPlayers = state.players.filter(
            player => player.clientId != state.turnPlayer?.clientId
        )

        return { transitionTo: 'PlayerSubmitWordHandler' }
    }
}
