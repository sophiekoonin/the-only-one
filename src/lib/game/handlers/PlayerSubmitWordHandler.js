import { GameStageMessageTypes } from '../MessageTypes'
import {
    createId,
    playerIsInActivePlayers,
    waitUntil
} from '../GameStateMachine'

export class PlayerSubmitWordHandler {
    constructor(waitForUsersFor) {
        this.waitForUsersFor = waitForUsersFor
        this.userTimeoutPromptAt = waitForUsersFor - 3_000
        this.userTimeoutPromptAt =
            this.userTimeoutPromptAt < 0
                ? this.waitForUsersFor
                : this.userTimeoutPromptAt
    }

    async execute(state, context) {
        this.submitted = 0

        state.players.forEach(player =>
            context.channel.sendMessage(
                {
                    kind: 'instruction',
                    type: GameStageMessageTypes.SUBMIT_WORD_REQUEST,
                    value: state.words[state.words.length - 1],
                    timeout: this.userTimeoutPromptAt
                },
                player.clientId
            )
        )

        const result = { transitionTo: 'CollateWordsHandler' }

        try {
            await waitUntil(
                () => this.submitted === state.nonTurnPlayers.length,
                this.waitForUsersFor
            )
        } catch (exception) {
            result.error = true
        }

        return result
    }

    async handleInput(state, context, message) {
        console.log({ state })
        if (!playerIsInActivePlayers(state, message.metadata)) {
            return
        }

        if (message.kind === GameStageMessageTypes.SUBMIT_WORD_RESPONSE) {
            state.clues.push({
                id: createId(),
                word: message.metadata.word,
                author: message.metadata.clientId,
                authorName: message.metadata.friendlyName
            })
            context.channel.sendMessage(
                { kind: 'instruction', type: 'wait' },
                message.metadata.clientId
            )

            this.submitted++
        }
    }
}
