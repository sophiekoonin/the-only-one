import { GameStageMessages } from '../gameStages'
import { waitUntil } from '../GameStateMachine'

export class PlayerGuessHandler {
    constructor(waitForUsersFor) {
        this.waitForUsersFor = waitForUsersFor
        this.userTimeoutPromptAt = waitForUsersFor - 3_000
        this.userTimeoutPromptAt =
            this.userTimeoutPromptAt < 0
                ? this.waitForUsersFor
                : this.userTimeoutPromptAt
    }
    async execute(state, context) {
        this.playerHasGuessed = false
        context.channel.sendMessage(
            {
                kind: 'instruction',
                type: GameStageMessages.PLAYER_GUESS_REQUEST,
                clues: state.clues,
                timeout: this.userTimeoutPromptAt
            },
            state.turnPlayer.clientId
        )

        state.nonTurnPlayers.forEach(player => {
            context.channel.sendMessage(
                {
                    kind: 'instruction',
                    type: GameStageMessages.PLAYER_IS_GUESSING,
                    clues: state.clues
                },
                player.clientId
            )
        })

        const result = { transitionTo: 'ShowResultHandler' }

        try {
            await waitUntil(
                () => this.playerHasGuessed === true,
                this.waitForUsersFor
            )
        } catch (exception) {
            result.error = true
        }
    }
}
