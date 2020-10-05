import { GameStageMessageTypes } from '../MessageTypes'
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
                type: GameStageMessageTypes.PLAYER_GUESS_REQUEST,
                clues: state.clues,
                timeout: this.userTimeoutPromptAt
            },
            state.turnPlayer.clientId
        )

        state.nonTurnPlayers.forEach(player => {
            context.channel.sendMessage(
                {
                    kind: 'instruction',
                    type: GameStageMessageTypes.PLAYER_IS_GUESSING,
                    clues: state.clues
                },
                player.clientId
            )
        })

        const result = { transitionTo: 'EndHandler' }

        try {
            await waitUntil(
                () => this.playerHasGuessed === true,
                this.waitForUsersFor
            )
        } catch (exception) {
            result.error = true
        }

        return result
    }

    async handleInput(state, context, message) {
        if (!playerIsTurnPlayer(state, message.metadata)) {
            return
        }

        if (message.kind === GameStageMessageTypes.PLAYER_GUESS_RESPONSE) {
            state.guess = message.guess
            this.playerHasGuessed = true
        }
    }
}

function playerIsTurnPlayer(state, playerIdentity) {
    return state.turnPlayer.clientId === playerIdentity.clientId
}
