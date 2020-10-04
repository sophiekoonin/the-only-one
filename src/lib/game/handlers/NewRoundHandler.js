export class NewRoundHandler {
    async execute(state) {
        state.activePlayers = state.players.slice()
        state.nonTurnPlayers = state.players.filter(
            player => player.clientId != state.turnPlayer?.clientId
        )

        return { transitionTo: 'PlayerSubmitWordHandler' }
    }
}
